// backend/src/services/betService.js
import Bet from "../models/Bet.js";
import Animal from "../models/Animal.js";
import GroupNumber from "../models/GroupNumber.js";
import User from "../models/User.js";
import Draw from "../models/Draw.js";
import DrawResult from "../models/DrawResults.js";
import sequelize from "../config/database.js";
import { MULTIPLIERS, validateBetValue, getGrupoByDezena } from "../utils/betUtils.js";

export class BetService {

  // ===== REALIZAR APOSTA =====
  static async placeBet(userId, { bet_type, bet_value, amount }) {
    return await sequelize.transaction(async (t) => {
      const normalizedValue = validateBetValue(bet_type, bet_value);
      const amountNum = parseFloat(amount);

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Valor da aposta inválido");
      }

      const user = await User.findByPk(userId, { transaction: t });
      if (!user) throw new Error("Usuário não encontrado");
      if (user.balance < amountNum) throw new Error("Saldo insuficiente");

      const multiplier = MULTIPLIERS[bet_type];
      const potential_prize = amountNum * multiplier;

      await user.decrement("balance", { by: amountNum, transaction: t });

      const bet = await Bet.create(
        {
          user_id: userId,
          bet_type,
          bet_value: normalizedValue,
          amount: amountNum,
          potential_prize,
          status: "pending",
        },
        { transaction: t }
      );

      let animalGroup = null;
      if (bet_type === "dezena") {
        animalGroup = await getGrupoByDezena(normalizedValue);
      }

      return {
        bet,
        animalGroup,
        newBalance: user.balance - amountNum,
        message: "Aposta realizada com sucesso!",
      };
    });
  }

  // ===== LISTAR APOSTAS DO USUÁRIO =====
  static async getUserBets(userId, { limit = 20, offset = 0 } = {}) {
    const bets = await Bet.findAll({
      where: { user_id: userId },
      attributes: [
        'id', 'bet_type', 'bet_value', 'amount', 'potential_prize',
        'status', 'drawn_value', 'created_at', 'updated_at'
      ],
      include: [{ model: Animal, as: 'animal', attributes: ['animal_name', 'group_number'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: false
    });

    return bets.map(bet => {
      const json = bet.toJSON();
      return {
        ...json,
        created_at: json.created_at ? new Date(json.created_at).toISOString() : null,
        updated_at: json.updated_at ? new Date(json.updated_at).toISOString() : null,
        amount: Number(json.amount),
        potential_prize: Number(json.potential_prize),
      };
    });
  }

  // ===== LISTAR SORTEIOS (TODOS) =====
  static async getDraws({ limit = 20, offset = 0 } = {}) {
    return await Draw.findAll({
      include: [{ model: DrawResult, as: "results" }],
      order: [["draw_datetime", "DESC"]],
      limit,
      offset,
    });
  }

  // ===== PROCESSAR SORTEIO =====
  static async processDraw() {
    console.log("[processDraw] === INICIANDO SORTEIO ===");

    try {
      return await sequelize.transaction(async (t) => {
        // 1. Gerar 5 milhares aleatórias
        const results = [];
        for (let i = 0; i < 5; i++) {
          const num = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
          results.push(num);
        }
        const milharVencedora = results[0];
        const dezenaVencedora = milharVencedora.slice(-2);
        console.log(`Resultado: milhar=${milharVencedora}, dezena=${dezenaVencedora}`);

        // 2. Criar registro do sorteio
        const draw = await Draw.create({
          draw_datetime: new Date(),
          status: "completed",
        }, { transaction: t });
        console.log(`Sorteio #${draw.id} criado`);

        // 3. Vincular resultados
        for (let i = 0; i < results.length; i++) {
          await DrawResult.create({
            draw_id: draw.id,
            position: i + 1,
            drawn_thousand: results[i],
          }, { transaction: t });
        }
        console.log(`${results.length} resultados vinculados`);

        // 4. Buscar apostas pendentes
        const pendingBets = await Bet.findAll({
          where: { status: "pending" },
          transaction: t,
        });
        console.log(`${pendingBets.length} apostas pendentes para processar`);

        let winnersCount = 0;
        let totalPaid = 0;

        // 5. Verificar cada aposta
        for (const bet of pendingBets) {
          let won = false;

          // Milhar: compara 4 dígitos exatos
          if (bet.bet_type === "milhar" && bet.bet_value === milharVencedora) {
            won = true;
            console.log(`MILHAR: ${bet.bet_value} == ${milharVencedora}`);
          }
          // Dezena: compara 2 dígitos exatos
          else if (bet.bet_type === "dezena" && bet.bet_value === dezenaVencedora) {
            won = true;
            console.log(`DEZENA: ${bet.bet_value} == ${dezenaVencedora}`);
          }
          // Grupo: busca animal da dezena sorteada → compara group_number
          else if (bet.bet_type === "grupo") {
            // Passo 1: Qual animal está associado à dezena sorteada?
            const groupRecord = await GroupNumber.findOne({
              where: { number: dezenaVencedora },
              attributes: ["animal_id"],
              transaction: t,
            });

            // Passo 2: Qual o group_number desse animal?
            if (groupRecord?.animal_id) {
              const animal = await Animal.findByPk(groupRecord.animal_id, {
                attributes: ["group_number"],
                transaction: t,
              });

              // Passo 3: Aposta bate com o grupo do animal?
              if (animal && Number(bet.bet_value) === animal.group_number) {
                won = true;
                console.log(`GRUPO: aposta=${bet.bet_value} == animal.group_number=${animal.group_number} (dezena sorteada: ${dezenaVencedora})`);
              }
            }
          }

          // 6. Atualizar status e creditar prêmio se ganhou
          if (won) {
            await bet.update({
              status: "won",
              drawn_value: milharVencedora,
            }, { transaction: t });

            await User.increment("balance", {
              by: bet.potential_prize,
              where: { id: bet.user_id },
              transaction: t,
            });

            winnersCount++;
            totalPaid += Number(bet.potential_prize);
            console.log(`Aposta #${bet.id} (user ${bet.user_id}) GANHOU R$ ${bet.potential_prize}`);
          } else {
            await bet.update({
              status: "lost",
              drawn_value: milharVencedora,
            }, { transaction: t });
            console.log(`Aposta #${bet.id} perdeu.`);
          }
        }

        console.log(`Sorteio concluído: ${winnersCount} ganhador(es), R$ ${totalPaid} pagos`);

        // 7. Retornar resumo
        return {
          draw,
          results,
          milhar: milharVencedora,
          dezena: dezenaVencedora,
          stats: {
            totalBets: pendingBets.length,
            winners: winnersCount,
            totalPaid,
          },
          message: `Sorteio processado! ${winnersCount} ganhador(es) de ${pendingBets.length} apostas.`,
        };
      });
    } catch (err) {
      console.error("[processDraw] ERRO CRÍTICO:", {
        name: err.name,
        message: err.message,
        code: err.code,
        sql: err.original?.sql,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      throw err;
    }
  }
}