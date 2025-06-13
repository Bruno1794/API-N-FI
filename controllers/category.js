const express = require('express')
const router = express.Router();
const yup = require('yup');
const db = require('../db/models');
const {eAdmin} = require('../services/authService')
const {Op} = require("sequelize");

router.get('/categorias', eAdmin, async (req, res) => {

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

    const categorias = await db.Category.findAll({
        attributes: ['id', 'name', 'status'],
        where,
        order: [[db.sequelize.fn('LOWER', db.sequelize.col('name')), 'ASC']]    })
    if (categorias.length > 0) {
        res.json({
            status: 'true',
            data: categorias
        })
    } else {
        res.json({
            status: 'false',
            mesage: "Sem registro categoria"
        })
    }
})

router.get('/categorias/:id', eAdmin, async (req, res) => {
    const {id} = req.params;

    const categoria = await db.Category.findByPk(id);

    if (!categoria) {
        return res.status(404).json({error: "Categoria não encontrada"});
    }

    const user = await db.Category.update(categoria,
        {where: {id: id}}
    )
    if (user) {
        res.json({
            status: 'true',
            data: categoria

        })
    } else {
        res.json({
            status: 'false',
            mesage: "Falha ao visualizar a categoria"
        })
    }


})

router.post('/categorias', eAdmin, async (req, res) => {
    const data = req.body;
    data.user_id = req.userId;

    const schema = yup.object().shape({
        name: yup.string().required("Campo nome e obrigatorio"),
    })
    try {

        await schema.validate(data)

    } catch (err) {
        res.json({
            status: "false",
            msg: err.errors
        })
    }

    await db.Category.create(data).then((result) => {
        res.json({
            status: 'true',
            data: result
        })
    }).catch((err) => {
        res.json({
            status: 'false',
            mesage: "Falha ao criar a categoria"
        })
    })
})

router.put('/categorias/:id', eAdmin, async (req, res) => {
    const {id} = req.params;
    const data = req.body;

    const schema = yup.object().shape({
        name: yup.string().required("Campo nome categoria é obrigatorio"),
    })
    try {
        await schema.validate(data)

    } catch (err) {
        res.json({
            status: 'false',
            mesage: err.errors
        })
    }

    const user = await db.Category.update(data, {
        where: {
            id: id
        }
    })
    if (user) {
        res.json({
            status: 'true',
            mesage: "Cateoria editada com sucesso"

        })
    } else {
        res.json({
            status: 'false',
            mesage: "Falha ao editar a categoria"
        })
    }


})

router.put('/categorias-status/:id', eAdmin, async (req, res) => {
    const {id} = req.params;

    const categoria = await db.Category.findByPk(id);

    if (!categoria) {
        return res.status(404).json({error: "Categoria não encontrada"});
    }

    const novoStatus = categoria.status === "ATIVO" ? "INATIVO" : "ATIVO";

    const user = await db.Category.update(
        {status: novoStatus},
        {where: {id: id}}
    )
    if (user) {
        res.json({
            status: 'true',
            mesage: `Categoria ${novoStatus} com sucesso`

        })
    } else {
        res.json({
            status: 'false',
            mesage: "Falha ao editar a categoria"
        })
    }


})

router.delete('/categorias/:id', eAdmin, async (req, res) => {
    const {id} = req.params;
    await db.Category.destroy({where: {id: id}})
    res.json({
        status: 'true',
        mesage: "Categoria deletada com sucesso"
    })
})

module.exports = router;
