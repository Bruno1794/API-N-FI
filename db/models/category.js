'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.hasMany(models.User, {foreignKey: 'user_id'})
            Category.hasMany(models.Moviment,{foreignKey: "category_id"})

        }
    }

    Category.init({
        name: DataTypes.STRING,
        status: DataTypes.ENUM("ATIVO", "INATIVO"),
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Category',
    });
    return Category;
};