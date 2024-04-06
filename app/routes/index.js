const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/authMiddleware');

// Rota da página inicial
router.get('/', checkAuthentication, (req, res) => {
    res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username });
});

// Rota para a página Sobre
router.get('/sobre', checkAuthentication, (req, res) => {
    res.render('sobre', { title: 'Sobre', active: 'sobre', username: req.session.user.username });
});

// Rota para a página FAQ
router.get('/faq', checkAuthentication, (req, res) => {
    res.render('faq', { title: 'FAQ', active: 'faq', username: req.session.user.username });
});

module.exports = router;
