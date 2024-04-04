const express = require('express');
const router = express.Router();

const userData = {
    nome: 'Nome do Usuário',
    sobrenome: 'Sobrenome do Usuário',
    email: 'email@exemplo.com',
    uidNumber: '123456',
    username: 'nomeusuario',
    memberOf: ['Grupo1', 'Grupo2', 'Grupo3'] // Exemplo de grupos
};

// Rota da página inicial
router.get('/', (req, res) => {
    res.render('index', { title: 'Página Inicial', active: 'home', username: userData.username});
});

// Rota para a página Sobre
router.get('/sobre', (req, res) => {
    res.render('sobre', { title: 'Sobre', active: 'sobre', username: userData.username});
});

// Rota para a página FAQ
router.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ', active: 'faq', username: userData.username});
});

module.exports = router;
