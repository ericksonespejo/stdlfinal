'use strict';
const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/logemp', (req, res) => {
    res.render('layouts/logInEmpleado.hbs');
});

router.post('/logemp', (req, res) => {
    console.log(req.body);
})

router.get('/tramites', async(req, res) => {
    await pool.query('SELECT * FROM bandejaTramitesRealizados;', (err,rows) =>{
      console.log(rows.ruta);
      res.render('layouts/bandejaTramitesRealizados.hbs',{rows});
    });
});

router.get('/municipal', (req, res) => {
    res.render('layouts/emp/home-emp.hbs');
});

router.get('/search', (req, res) => {
    res.render('layouts/emp/buscar.hbs');
});

router.get('/docarchi', (req, res) => {
    res.render('layouts/emp/docarchivados.hbs');
});

router.get('/docrecieve', (req, res) => {
    res.render('layouts/emp/docporrecibir.hbs');
});

router.get('/gentramite', (req, res) => {
    res.render('layouts/emp/generartramite.hbs');
});

router.get('/docprocess', (req, res) => {
    res.render('layouts/emp/documentosenproceso.hbs');
});

module.exports = router;
