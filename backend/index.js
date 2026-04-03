// index.js
import dotenv from "dotenv";
dotenv.config();

console.log("Variáveis carregadas:", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_HOST);


import sequelize from "./src/config/database.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco estabelecida com sucesso!");

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados com o banco!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao inicializar o banco:", error);
  }
})();
