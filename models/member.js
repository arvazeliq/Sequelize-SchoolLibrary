'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member extends Model {
    static associate(models) {
      this.hasMany(models.borrow, {
        foreignKey: 'memberID', as: "borrow"
      })
    }
  }
  member.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    contact: DataTypes.STRING,
    address: DataTypes.STRING,
    profile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'member',
  });
  return member;
};