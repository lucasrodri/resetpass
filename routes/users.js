const express = require('express');
const router = express.Router();

// Login de usuário
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', layout: 'userMain' });
});

// Outras rotas de usuário podem ser adicionadas aqui

module.exports = router;
