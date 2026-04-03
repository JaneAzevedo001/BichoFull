// src/routes/authRoutes.js
import express from "express";
import { register, login, me } from "../controllers/authController.js";
import {authenticateToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);


// rota protegida // Perfil do usuário logado
router.get("/auth/me", authenticateToken, me);

export default router;
