//types/Bet.ts
export interface Animal {
  id: number;
  animal_name: string;
  group_number: number;
  dezenas: string[];
  img?: string;
}

export type BetType = "grupo" | "dezena" | "milhar";

export interface BetFormData {
  type: BetType;
  value: string;
  amount: string;
}

export interface BetPayload {
  bet_type: BetType;
  bet_value: string;
  amount: number;
}

export interface BetResponse {
  message: string;
  bet: {
    id: number;
    potential_prize: string;
    [key: string]: any;
  };
}
