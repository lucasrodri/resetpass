const express = require('express');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv')
const session = require('express-session');

const PORT = process.env.PORT || 5000;

dotenv.config({ path: './.env' })

const path = require("path")

const app = express();

// Middleware para analisar application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'R6HfYwd5LaZZfuQPnDnk5Bx3YLZkGbaWQGDQJ2D3',
    resave: false,
    saveUninitialized: false,
}));

app.engine('hbs', engine({
    helpers: {
        eq: (v1, v2) => v1 === v2
    },
    extname: 'hbs',
    defaultLayout: 'main',
    defaultLayout: 'main', // Definindo o layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // O diretório dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Alterado para 'partials'
}));

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))

// Importar rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Usar as rotas importadas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Rotas de erro devem ser adicionadas após todas as outras rotas
const errorRoutes = require('./routes/errorRoutes');
app.use(errorRoutes);

app.listen(PORT, () => { // Alterado para usar a variável PORT
    console.log(`Server started on port ${PORT}`);
});
