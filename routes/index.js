const express = require('express');
const router = express.Router();

// Rota da página inicial
router.get('/', (req, res) => {
  res.render('index', { title: 'Página Inicial' });
});

module.exports = router;
