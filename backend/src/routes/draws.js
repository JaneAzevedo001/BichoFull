import express from "express";
import { BetService } from "../services/betService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Listar sorteios
router.get("/", async (req, res) => {
  try {
    const draws = await BetService.getDraws();
    res.json(draws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simular sorteio
router.post("/simulate", authenticateToken, async (req, res) => {
  try {
    const result = await BetService.processDraw();
    
    res.json({
      success: true,
      message: result.message,
      winners: result.stats?.winners ?? 0,  
      totalPaid: result.stats?.totalPaid ?? 0,
      draw: result.draw,
      results: result.results,
    });
  } catch (err) {
    console.error("Erro ao simular sorteio:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
