const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/authMiddleware');
const { client, bindLDAP, getUserData } = require('../services/ldapClient');

router.post('/login', async (req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  try {
    const isAuthenticated = await bindLDAP(username, password);
    if (isAuthenticated) {
      req.session.isAuthenticated = true;
      req.session.user = {
        username: username
      };
      // Autenticação bem-sucedida, redireciona para a rota /perfil
      res.redirect('/users/perfil');
    } else {
      // Falha na autenticação, renderiza a página de login com um erro
      console.log(`Falha na autenticação do usuário ${username}.`);
      res.render('login', { title: 'Login', layout: 'userMain', loginError: 'Usuário ou senha incorretos.' });
    }
  } catch (error) {
    // Em caso de erro na execução do bindLDAP
    console.error(error);
    res.render('login', { title: 'Login', layout: 'userMain', loginError: 'Erro ao processar a solicitação de login.' });
  }
});

// Login de usuário
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', layout: 'userMain' });
});

// Logout de usuário
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao encerrar a sessão:', err);
    }
    res.redirect('/users/login');
  });
});

router.get('/perfil', checkAuthentication, async (req, res) => {
  const username = req.session.user.username;  
  try {
    const rawData = await getUserData(username);
    let transformedData = {};
    rawData.attributes.forEach(attribute => {
      transformedData[attribute.type] = attribute.values;
    });
    console.log('Dados do usuário:', transformedData);
    const userData = {
      nome: transformedData.cn,
      sobrenome: transformedData.sn,
      email: transformedData.mail,
      uidNumber: transformedData.uidNumber,
      username: req.session.user.username,
      memberOf: ['Grupo1', 'Grupo2', 'Grupo3'] // Exemplo de grupos
    };
    res.render('perfil', { userData, username: userData.username });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
