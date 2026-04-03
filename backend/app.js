//app.js
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js"; 
import userRoutes from "./src/routes/userRoutes.js";
import animalsRouter from "./src/routes/animalsRouter.js";
import betRoutes from "./src/routes/betRoutes.js";
import drawRoutes from "./src/routes/draws.js";
import historyRoutes from "./src/routes/history.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // libera apenas o front
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// registra as rotas
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/animals", animalsRouter);
app.use("/api/bets", betRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/draws", drawRoutes);

export default app;
