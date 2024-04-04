const express = require('express');
const router = express.Router();

// Login de usuário
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', layout: 'userMain' });
});

router.get('/perfil', (req, res) => {
    const userData = {
        nome: 'Nome do Usuário',
        sobrenome: 'Sobrenome do Usuário',
        email: 'email@exemplo.com',
        uidNumber: '123456',
        username: 'nomeusuario',
        memberOf: ['Grupo1', 'Grupo2', 'Grupo3'] // Exemplo de grupos
    };

    res.render('perfil', userData);
});

module.exports = router;
