import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Animal from "./Animal.js";

const GroupNumber = sequelize.define("GroupNumber", {
  number: {
    type: DataTypes.STRING(2),
    allowNull: false,
    validate: {
      is: /^[0-9]{2}$/ // garante formato "00" a "99"
    }
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Animal,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'group_numbers',
  timestamps: false
});

Animal.hasMany(GroupNumber, {
  foreignKey: 'animal_id',
  as: 'dezenas',      
  onDelete: 'CASCADE'
});

GroupNumber.belongsTo(Animal, {
  foreignKey: 'animal_id',
  as: 'animal'
});

export default GroupNumber;