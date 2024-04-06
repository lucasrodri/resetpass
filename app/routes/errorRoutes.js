const express = require('express');
const router = express.Router();

// Capture 404 e encaminhe para o manipulador de erro
router.use((req, res, next) => {
  res.status(404).render('404', { title: '404: Página não encontrada' });
});

// Manipulador de erros do servidor
router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = err.status || 500;
  res.status(statusCode).render('500', {
    title: `${statusCode}: Erro do Servidor`,
    error: err,
  });
});

module.exports = router;
