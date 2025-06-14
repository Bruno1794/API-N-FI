'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bank extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Bank.hasMany(models.User, {foreignKey: 'user_id',})
            Bank.hasMany(models.Moviment, {foreignKey: "bank_id"})
        }
    }

    Bank.init({
        name: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Bank',
    });
    return Bank;
};