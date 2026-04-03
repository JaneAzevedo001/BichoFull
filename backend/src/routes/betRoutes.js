import express from "express";
import { BetService } from "../services/betService.js";

const router = express.Router();

// Criar nova aposta
router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId; 
    const { bet_type, bet_value, amount } = req.body;

    const result = await BetService.placeBet(userId, { bet_type, bet_value, amount });

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar aposta:", error);
    res.status(400).json({ error: error.message });
  }
});

// Listar apostas do usuário
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const bets = await BetService.getUserBets(userId);
    res.json(bets);
  } catch (error) {
    console.error("Erro ao listar apostas:", error);
    res.status(400).json({ error: error.message });
  }
});

// Processar sorteio
router.post("/draw", async (req, res) => {
  try {
    const { drawnNumber } = req.body;
    const result = await BetService.processDraw(drawnNumber);
    res.json(result);
  } catch (error) {
    console.error("Erro ao processar sorteio:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
