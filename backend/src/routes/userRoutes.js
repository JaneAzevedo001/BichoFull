// src/routes/userRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { updateUser, updatePassword } from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

// Listar todos os usuários
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "full_name", "email", "balance", "created_at"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar usuário por ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "full_name", "email", "balance", "created_at"]
    });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar dados do usuário
router.put("/:id", authenticateToken, updateUser);

// Atualizar senha do usuário logado
router.put("/password", authenticateToken, updatePassword);

export default router;
