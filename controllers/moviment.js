const express = require("express");
const router = express.Router();
const db = require('../db/models');
const {eAdmin} = require('../services/authService')
const {Op} = require("sequelize");

router.get('/movimentos', eAdmin, async (req, res) => {

    let filtro = req.query;

    // Soma das receitas
    const totalReceitas = await db.Moviment.sum('valor', {
        where: {
            user_id: req.userId,
            type_moviment: 'RECEITA'
        }
    });

    // Soma das despesas
    const totalDespesas = await db.Moviment.sum('valor', {
        where: {
            user_id: req.userId,
            type_moviment: 'DESPESAS'
        }
    });
    const where = {
        user_id: req.userId
    };

// Só aplica o filtro se vier o parâmetro 'p'
    if (filtro.p) {
        where.name = {
            [Op.substring]: filtro.p
        };
    }

    //Listando as movimentaçoes
    const movimentos = await db.Moviment.findAll({
        attributes: ['id', 'name', 'valor','type_moviment', 'date_venciment','status','createdAt'],
        where,
        include: [
            {
                model: db.Bank,
                attributes: ['id', 'name']
            },
            {
                model: db.Category,
                attributes: ['id', 'name']
            }
        ],
        order: [['date_venciment', 'asc']]
    })


    return res.json({
        success: true,
        data: movimentos,
        totais: {
            receitas: totalReceitas || 0,
            despesas: totalDespesas || 0

        }
    })


})

router.post('/movimentos', eAdmin, async (req, res) => {
    const data = {
        ...req.body,
        user_id: req.userId
    };

    try {
        const result = await db.Moviment.create(data);

        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Falha ao registrar um Movimento",
            error: error.message
        });
    }
})

router.delete('/movimentos/:id', eAdmin, async (req, res) => {
    const {id} = req.params;

    try {
        const deleted = await db.Moviment.destroy({where: {id}});

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "Movimento não encontrado ou já foi deletado"
            });
        }

        return res.json({
            success: true,
            message: "Deletado com sucesso"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao deletar o movimento",
            error: error.message
        });
    }
})


module.exports = router;