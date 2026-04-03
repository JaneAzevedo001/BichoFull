//utils/beUtils.js
import Animal from "../models/Animal.js";
import GroupNumber from "../models/GroupNumber.js";

// Multiplicadores por tipo de aposta
export const MULTIPLIERS = {
  grupo: 18,
  dezena: 60,
  milhar: 4000,
};

// Valida e normaliza o valor da aposta
export function validateBetValue(bet_type, bet_value) {
  switch (bet_type) {
    case "grupo": {
      const num = parseInt(bet_value, 10);
      if (isNaN(num) || num < 1 || num > 25) {
        throw new Error("Grupo deve ser entre 1 e 25");
      }
      return String(num);
    }
    case "dezena": {
      const normalized = String(bet_value).padStart(2, "0");
      if (!/^\d{2}$/.test(normalized)) {
        throw new Error("Dezena deve ser dois dígitos (00-99)");
      }
      return normalized;
    }
    case "milhar": {
      const normalized = String(bet_value).padStart(4, "0");
      if (!/^\d{4}$/.test(normalized)) {
        throw new Error("Milhar deve ser quatro dígitos (0000-9999)");
      }
      return normalized;
    }
    default:
      throw new Error("Tipo de aposta inválido");
  }
}

//Encontra o grupo correspondente a uma dezena
export async function getGrupoByDezena(dezena) {
  const groupNumber = await GroupNumber.findOne({
    where: { number: dezena },
    include: [{ model: Animal, as: "animal", attributes: ["id", "group_number", "animal_name"] }],
  });
  return groupNumber?.animal || null; 
}

