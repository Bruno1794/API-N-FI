const express = require('express')
const router = express.Router();
const yup = require('yup');
const db = require('../db/models');
const  { Op } = require('sequelize');
const {eAdmin} = require('../services/authService')

router.get('/bancos', eAdmin, async (req, res) => {

    let filtro = req.query;

    const where = {
        user_id: req.userId
    };

// Só aplica o filtro se vier o parâmetro 'p'
    if (filtro.p) {
        where.name = {
            [Op.substring]: filtro.p
        };
    }

    const bancos = await db.Bank.findAll({
        attributes: ['id', 'name'],
        where,
    order: [['name', 'asc']]
    })
    return res.json({
        success: true,
        data: bancos
    });
})

router.post('/bancos', eAdmin, async (req, res) => {
    const data = req.body;
    data.user_id = req.userId;
    console.log(data);

    await db.Bank.create(data).then((resul) => {
        return res.json({
            success: true,
            data: resul
        })
    }).catch((err) => {
        return res.json({
            success: false,
            message: "Falha ao cadastrar banco"
        })
    })

})

router.get('/bancos/:id', eAdmin, async (req, res) => {
    const {id} = req.params

    const banco = await db.Bank.findByPk(id, {
        attributes: ['id', 'name']
    });
    if (!banco) {
        return res.status(404).json({
            success: false,
            message: "Banco nao  encontrada"
        })
    }

    return res.json({
        success: true,
        data: banco
    })
})

router.put('/bancos/:id', eAdmin, async (req, res) => {
    const {id} = req.params
    const data = req.body;

    await db.Bank.update(data, {where: {id: id}
    }).then((result) => {
        return res.json({
            success: true,
            message: "Banco alterado com sucesso"
        })
    }).catch((err) => {
        return res.json({
            success: false,
            message: "Falha ao alterar banco"
        })
    })
})

router.delete('/bancos/:id', eAdmin, async (req, res) => {
    const {id} = req.params
    await db.Bank.destroy({where: {id: id}}).then((result) => {
        return res.json({
            success: true,
            message: "Banco deletado"
        })
    }).catch((err) => {
        return res.json({
            success: false,
            message: "Falha ao deletar banco"
        })
    })
})


module.exports = router;