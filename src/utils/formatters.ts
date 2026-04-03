import { BetType } from "../types/Bet.ts";

//Formata valor para BRL
export const formatBRL = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "Saldo não disponível";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

//Formata o valor da aposta conforme o tipo
export const formatBetValue = (type: BetType, value: string): string => {
  if (type === "dezena") return value.padStart(2, "0");
  if (type === "milhar") return value.padStart(4, "0");
  return value; // grupo já é número simples
};

//Remove caracteres não-numéricos
export const sanitizeDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

//Valida formato decimal para valor em R$
export const isValidDecimal = (value: string): boolean => {
  return value === "" || /^\d*\.?\d{0,2}$/.test(value);
};