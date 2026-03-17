// backend/routes/betRoutes.js
import express from "express";
import { getHistory } from "../controllers/betController.js";

const router = express.Router();
router.get("/history", getHistory);
export default router;
