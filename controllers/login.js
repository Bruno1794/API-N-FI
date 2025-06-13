const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const yup = require('yup');
const db = require('../db/models');

const router = express.Router();

router.post('/', async (req, res) => {

    const data = req.body;
    console.log(data);

    const schema = await yup.object().shape({
        username: yup.string().required("Campo usuario Obrigatorio"),
        password: yup.string().required("Campo senha Obrigatorio"),
    })

    try {
        await schema.validate(data);

    } catch (err) {
        res.status(500).json({
            message: err.errors
        })
    }
    const user = await db.User.findOne({
        attributes: ['id', 'username', 'password', 'email'],
        where: {username: data.username}
    })

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Erro: Usuario ou senha  incorreta"
        })
    }

    if (!(await bcrypt.compare(String(data.password), String(user.password)))) {
        return res.status(401).json({
            success: false,
            message: "Erro: Usuario ou senha incorreta"
        })
    }

    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    })


    return res.json({
        success: true,
        token: token,
        data: {id: user.id, username: user.username, email: user.email}
    })
});

module.exports = router;