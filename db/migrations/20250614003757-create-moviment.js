'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Moviments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            valor: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0.00
            },
            type_moviment: {
                type: Sequelize.ENUM("RECEITA", "DESPESAS"),
                defaultValue: "RECEITA"
            },
            status: {
                type: Sequelize.ENUM("PAGO", "PENDENTE"),
                defaultValue: "PENDENTE"
            },
            date_venciment: {
                type: Sequelize.DATEONLY

            },
            date_pagamento: {
                type: Sequelize.DATEONLY

            },
            bank_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Banks',
                    key: 'id'
                },
                allowNull: true

            },
            category_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id'
                },
                allowNull: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Moviments');
    }
};