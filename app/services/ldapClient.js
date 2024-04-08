const ldap = require('ldapjs');

// Carregar variáveis de ambiente
require('dotenv').config();

// Configurar cliente LDAP
const client = ldap.createClient({
    url: `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`,
    tlsOptions: { rejectUnauthorized: true }, // Deve ser true em produção
    reconnect: true // Reconectar se a conexão for perdida
});

// Função para conectar ao LDAP
async function bindLDAP(username, password) {
    return new Promise((resolve, reject) => {
        //sanitize input
        if (!username || !password) {
            return res.render('login', { title: 'Login', layout: 'userMain', loginError: 'Usuário ou senha incorretos.' });
        }
        //sanitize username, Permitir letras, números, pontos e sublinhados
        username = username.replace(/[^a-zA-Z0-9._]/g, '');

        let ldapFilter = process.env.LDAP_SEARCH_FILTER.replace('%s', username);
        ldapFilter = ldapFilter.replace('(', '');
        ldapFilter = ldapFilter.replace(')', '');

        const dn = `${ldapFilter},${process.env.LDAP_USER_DN},${process.env.LDAP_BASE_DN}`;

        console.log('Tentando autenticar usuário:', dn);

        client.bind(dn, password, async (err) => {
            if (err) {
                // Falha na autenticação
                console.error('Erro de autenticação LDAP: Credenciais inválidas.');
                client.unbind();
                resolve(false);
            } else {
                console.log('Usuário autenticado');
                client.unbind();
                resolve(true);
            }
        });
    });
}

// Função para o admin autenticar no LDAP
async function bindLDAPClient() {
    return new Promise((resolve, reject) => {
        client.bind('cn=admin,dc=gigacandanga,dc=net,dc=br', 'admin', async (err) => {
            if (err) {
                reject(new Error(`Falha ao autenticar com LDAP: ${err.message}`));
            } else {
                console.log('LDAP autenticado com o usuário de serviço.');
                resolve();
            }
        });
    });
}

// Função para buscar dados do usuário
async function getUserData(username) {
    try {
        // Primeiro, autenticamos o cliente LDAP
        await bindLDAPClient();

        // Agora, continuamos com a busca
        return new Promise((resolve, reject) => {
            let ldapFilter = process.env.LDAP_SEARCH_FILTER.replace('%s', username);
            console.log('Buscando dados do usuário:', ldapFilter);
            const opts = {
                filter: ldapFilter,
                scope: 'sub',
                attributes: ['cn', 'sn', 'mail', 'uidNumber', 'memberOf']
            };

            client.search(process.env.LDAP_BASE_DN, opts, (err, res) => {
                if (err) {
                    console.error('Erro ao buscar dados do usuário:', err);
                    return reject(err);
                } 
                let userFound = false;

                res.on('searchEntry', (entry) => {
                    userFound = true;
                    console.log('Usuário encontrado!');
                    resolve(entry.pojo);
                });

                res.on('error', (err) => {
                    console.error('Erro ao buscar dados do usuário:', err);
                    reject(err);
                });
            });
        });

    } catch (error) {
        throw error;
    }
}

module.exports = {
    client,
    bindLDAP,
    getUserData
};
