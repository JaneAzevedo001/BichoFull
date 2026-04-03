import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Animal = sequelize.define("Animal", {
  group_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 1,
      max: 25
    }
  },
  animal_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
}, {
  tableName: 'animals',
  timestamps: false
});

export default Animal;