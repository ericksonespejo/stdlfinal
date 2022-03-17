'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('layouts/logInUsuario.hbs');
});

router.post('/', async(req, res, next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/userperfil',
        failureRedirect: '/',
        failureFlash:true
    })(req, res, next);
});

router.get('/registro', (req, res) =>{
    res.render('layouts/registroGestor.hbs');
});

router.post('/registro', passport.authenticate('local.signup',{
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash:true
}));

router.get('/registroemp', (req, res) => {
    res.render('layouts/superadmin/registroEmpleado.hbs');
});

router.post('/registroemp', passport.authenticate('local.signupemp',{
    successRedirect: '/logemp',
    failureRedirect: '/',
    failureFlash:true
}));

router.post('/logout',(req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;
