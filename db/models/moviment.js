'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Moviment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Moviment.belongsTo(models.User, {foreignKey: 'user_id'});
            Moviment.belongsTo(models.Category, {foreignKey: 'category_id'});
            Moviment.belongsTo(models.Bank, {foreignKey: 'bank_id'});
        }
    }

    Moviment.init({
        name: DataTypes.STRING,
        valor: DataTypes.DECIMAL,
        type_moviment: DataTypes.ENUM("RECEITA", "DESPESAS"),
        status: DataTypes.ENUM("PAGO", "PENDENTE"),
        bank_id: DataTypes.INTEGER,
        date_venciment: DataTypes.DATEONLY,
        date_pagamento: DataTypes.DATEONLY,
        category_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Moviment',
    });
    return Moviment;
};