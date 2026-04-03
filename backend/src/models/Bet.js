// backend/src/models/Bet.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Animal from "./Animal.js";

const Bet = sequelize.define("Bet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE'
  },
  bet_type: {
    type: DataTypes.ENUM('grupo', 'dezena', 'milhar'),
    allowNull: false
  },
  // Valor apostado (ex: 10.00)
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 }
  },
  // O que foi apostado:
  // - grupo: number do animal (1-25)
  // - dezena: string "00" a "99"
  // - milhar: string "0000" a "9999"
  bet_value: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  // Prêmio potencial (calculado no momento da aposta)
  potential_prize: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  // Status da aposta
  status: {
    type: DataTypes.ENUM('pending', 'won', 'lost'),
    defaultValue: 'pending'
  },
  // Resultado do sorteio (preenchido após o sorteio)
  drawn_value: {
    type: DataTypes.STRING(4),
    allowNull: true
  }
}, {
  tableName: 'bets',
  timestamps: true,
  underscored: true
});

// Relacionamentos
Bet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Bet.belongsTo(Animal, { 
  foreignKey: 'bet_value', 
  targetKey: 'group_number',
  as: 'animal',
  constraints: false 
});

export default Bet;