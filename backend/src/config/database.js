// backend/src/config/database.js
import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

console.log("Conectando com:", {
  user: process.env.DB_USER,
  password: "***",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, 
    timezone: "-04:00",
    
    define: {
      freezeTableName: true,  
      timestamps: false,      
      underscored: true,      
    },
    
    //Pool de conexões
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

//Testar conexão ao iniciar 
sequelize.authenticate()
  .then(() => console.log("Conexão com MySQL estabelecida!"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

export default sequelize;