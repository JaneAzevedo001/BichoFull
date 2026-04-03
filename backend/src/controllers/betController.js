// backend/src/controllers/betController.js
import { BetService } from "../services/betService.js";

export class BetController {

  // POST /api/bets - Realizar aposta
  static place = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { bet_type, bet_value, amount } = req.body;

      const result = await BetService.placeBet(userId, {
        bet_type,
        bet_value,
        amount
      });

      res.status(201).json(result);

    } catch (error) {
      console.error('Erro ao realizar aposta:', error);
      res.status(400).json({
        error: 'Erro ao realizar aposta',
        message: error.message
      });
    }
  };

  // GET /api/bets - Listar apostas do usuário
  static list = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { limit, offset } = req.query;
      const bets = await BetService.getUserBets(userId, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined
      });

      res.json(bets);

    } catch (error) {
      console.error('Erro ao listar apostas:', error);
      res.status(500).json({ error: 'Erro ao listar apostas' });
    }
  };

  static processDraw = async (req, res) => {
    try {
      const { drawn_number } = req.body; // ex: "1234"

      if (!/^\d{4}$/.test(drawn_number)) {
        return res.status(400).json({ error: 'Número sorteado deve ter 4 dígitos' });
      }

      const result = await BetService.processDraw(drawn_number);
      res.json(result);

    } catch (error) {
      console.error('Erro ao processar sorteio:', error);
      res.status(500).json({
        error: 'Erro ao processar sorteio',
        message: error.message
      });
    }
  };
}