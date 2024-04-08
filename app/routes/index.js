const express = require('express');
const router = express.Router();

const ldap = require('ldapjs');

const checkAuthentication = require('../middleware/authMiddleware');
const { client, bindLDAP, bindLDAPClient } = require('../services/ldapClient');

// Rota da página inicial
router.get('/', checkAuthentication, (req, res) => {
    res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username });
});

router.post('/alterarSenha', checkAuthentication, async (req, res) => {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    // Verificar se a nova senha atende aos requisitos e se as senhas coincidem
    //A senha deve ter pelo menos 8 caracteres, incluindo um número, uma letra maiúscula, uma letra minúscula e um caractere especial.
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordError: 'A senha deve ter pelo menos 8 caracteres, incluindo um número, uma letra maiúscula, uma letra minúscula e um caractere especial.' });
    }
    // Verificar se a nova senha e a confirmação coincidem
    if (newPassword !== confirmPassword) {
        return res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordError: 'As senhas não coincidem.' });
    }
    // Verificar se a senha atual está correta
    const username = req.session.user.username;
    const isAuthenticated = await bindLDAP(username, currentPassword);
    if (isAuthenticated) {
        // Senha correta, alterar a senha
        try {
            await bindLDAPClient();
            const change = new ldap.Change({
                operation: 'replace',
                modification: {
                    type: 'userPassword',
                    values: [newPassword]
                }
            });
            let ldapFilter = process.env.LDAP_SEARCH_FILTER.replace('%s', username);
            ldapFilter = ldapFilter.replace('(', '');
            ldapFilter = ldapFilter.replace(')', '');
            const dn = `${ldapFilter},${process.env.LDAP_USER_DN},${process.env.LDAP_BASE_DN}`;
                client.modify(dn, change, (err) => {
                if (err) {
                    console.error('Erro ao alterar a senha:', err);
                    res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordError: 'Erro ao alterar a senha.' });
                } else {
                    console.log('Senha alterada com sucesso.');
                    res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordSuccess: 'Senha alterada com sucesso.' });
                }
            });
        } catch (error) {
            console.error('Erro ao alterar a senha:', error);
            res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordError: 'Erro ao alterar a senha.' });
        }
    } else {
        // Senha incorreta
        res.render('index', { title: 'Página Inicial', active: 'home', username: req.session.user.username, passwordError: 'Senha incorreta.' });
    }
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
