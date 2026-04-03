// backend/src/routes/history.js
import express from "express";
import { BetService } from "../services/betService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    
    console.log("[DEBUG] userId extraído:", userId);
    
    if (!userId) {
      return res.status(401).json({ error: "Usuário não identificado no token" });
    }

    const bets = await BetService.getUserBets(userId);
    console.log(`[DEBUG] ${bets.length} apostas encontradas para user ${userId}`);
    
    res.json(bets);
  } catch (err) {
    console.error("[history.js] Erro:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;