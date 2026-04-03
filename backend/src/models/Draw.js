// backend/src/models/Draw.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Draw = sequelize.define(
  "Draw",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    draw_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "completed",
    },
  },
  {
    tableName: "draws",
    timestamps: false,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Draw;