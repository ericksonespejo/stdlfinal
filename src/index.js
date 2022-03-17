'use strict'

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys');

//initializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'ThunderGers',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(fileUpload());
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//global Variables
app.use((req, res, next) => {
    if (req.user) {
        app.locals.user = req.user[0];
    }
    next();
});

//routes
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/emp', require('./routes/empleado'));
app.use('/admin', require('./routes/superadmin'));

//public files
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public/images')));

//starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
