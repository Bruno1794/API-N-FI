const jwt = require('jsonwebtoken')
const {promisify} = require('util');

module.exports = {

    eAdmin: async function (req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: false,
                message: 'Erro: é necessario realizar o login para acessar a pagina'
            })
        }

        const [bearer, token] = authHeader.split(' ')

        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Erro: é necessrio enviar o token'
            })
        }

        try {
            const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
            req.userId = decode.id;
            return next();

        } catch (err) {
            return res.status(401).json({
                status: false,
                message: "Error: Necessario realizar o login para acessar a pagina"
            })
        }

    }
}