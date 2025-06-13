const express = require('express');
const cors = require('cors');
const compression = require('compression'); // importa depois do express
const app = express();

app.use(compression()); // aplica antes de tudo
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Controllers
const usuarios = require('./controllers/usuario');
const login = require('./controllers/login');
const category = require('./controllers/category');
const bancos = require('./controllers/bank');

// Rotas organizadas
app.use('/', usuarios);
app.use('/login', login);
app.use('/', category);
app.use('/', bancos);

app.listen(8000, () => console.log("Servidor rodando na porta 8000"));
