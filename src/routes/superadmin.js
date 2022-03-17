'use strict';
const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/homeadmin', (req, res) => {
    res.render('layouts/superadmin/home.hbs');
});



module.exports = router;
