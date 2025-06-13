const express = require('express');
const bcrypt = require('bcryptjs');
const yup = require('yup');
const db = require('../db/models');
const {eAdmin} = require('../services/authService')


const router = express.Router();

router.get('/usuarios', eAdmin, async (req, res) => {

    const {page = 1} = req.query;

    const limit = 10;

    var lastPage = 1;

    const countUser = await db.User.count()

    if (countUser !== 0) {
        lastPage = Math.ceil(countUser / limit)


    } else {
        return res.status(400).json({
            status: "success",
            message: "Erro: Nenhum usuario encontrado",
        })
    }


    const users = await db.User.findAll({
        attributes: ['id', 'name', 'email', 'username'],
        order: [['id', 'DESC']],
        offset: Number((page * limit) - limit),
        limit: limit
    })
    return res.json({
        status: "success",
        lastPage: lastPage,
        data: users,
    })
})

router.get('/usuario-logado', eAdmin, async (req, res) => {

    const user = await db.User.findOne({
        attributes: ['id', 'name', 'email', 'username'],
        where: {
            id: req.userId
        }
    });
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "usuario nao encontrado",
        })
    }
    return res.status(200).json({
        status: "success",
        user: user,
    })
})

router.get('/usuarios/:id', eAdmin, async (req, res) => {

    const {id} = req.params;

    const users = await db.User.findOne({
        attributes: ['id', 'name', 'email', 'username'],
        where: {
            id: id
        },


    })
    return res.json({
        status: "success",
        data: users,
    })
})

router.post('/usuarios', eAdmin, async (req, res) => {
    const usuario = req.body;

    const schema = yup.object().shape({
        name: yup.string().required("Campo nome Obrigatorio"),
        email: yup.string().required("Campo email Obrigatorio"),
        phone: yup.string().required("Campo fone Obrigatorio"),
        password: yup.string().required("Campo password Obrigatorio")
    })

    try {

        await schema.validate(usuario);

    } catch (err) {
        res.json({
            status: "false",
            msg: err.errors
        })
    }

    usuario.password = await bcrypt.hash(String(usuario.password), 8)

    await db.User.create(usuario).then((result) => {
        res.json({
            status: "success",
            msg: result
        });
    }).catch((err) => {
        res.json({
            status: "false",
            msg: err
        })
    })
})

router.put('/usuarios/:id', eAdmin, async (req, res) => {
    const id = req.params.id;
    const usuario = req.body;
    try {

        const user = await db.User.update(usuario, {where: {id: id}})

        if (user) {
            const updatedUser = await db.User.findByPk(id, {
                attributes: ['id', 'name', 'email', 'username'],
            });
            res.status(200).json({
                status: "success",
                data: updatedUser
            });
        } else {
            res.status(404).json({message: 'Usuário não encontrado'});
        }

    } catch (err) {
        res.status(500).json({message: 'Erro ao atualizar usuário'});

    }


})

router.delete('/usuarios/:id', eAdmin, async (req, res) => {
    const {id} = req.params;

    await db.User.destroy({where: {id: id}})

    res.status(200).json({
        status: "success",
        msg: "Deletado com sucesso"
    })

})


module.exports = router;


