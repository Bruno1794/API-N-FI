const express = require('express');
const cors = require('cors');
const app = express();

//e um middlewer  necessario para receber os dados em JSON
app.use(express.json());

//middlewer de requisição para evitar problema com cors
app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Acecess-Control-Allow-Headers", "content-type, Authorization");
    app.use(cors());
    next();

});

//controllers
const usuarios = require('./controllers/usuario');
const login = require('./controllers/login');
const category = require('./controllers/category');
const bancos = require('./controllers/bank');

//rostas para acessa controllers
app.use('/', usuarios);
app.use('/login', login);
app.use('/', category);
app.use('/', bancos);

//porta do servidor
app.listen(8000, () => console.log("Servidor rodando port 8080"));