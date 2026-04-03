// backend/src/models/DrawResult.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Draw from "./Draw.js";

const DrawResult = sequelize.define(
  "DrawResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    draw_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Draw,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Posição no sorteio (1 a 5)",
    },
    drawn_thousand: {
      type: DataTypes.STRING(4),
      allowNull: false,
      comment: "Milhar sorteada (0000-9999)",
    },
  },
  {
    tableName: "draw_results",
    timestamps: false, 
    underscored: true,
  }
);

//Associação com Draw
Draw.hasMany(DrawResult, {
  foreignKey: "draw_id",
  as: "results", 
});
DrawResult.belongsTo(Draw, {
  foreignKey: "draw_id",
  as: "draw",
});

export default DrawResult;