'use strict';

const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs');

router.get('/forgotpass', (req, res) => {
    res.render('layouts/olvideMiContrasena.hbs');
});

router.post('/forgotpass', (req, res) => {
    console.log(req.body);

});

router.get('/user', async(req, res) => {
    console.log("DNI: "+req.user[0].DNI);
    const query = `SELECT * FROM bandejaTramitesRealizados WHERE id_Usuario=${req.user[0].DNI};`;
    console.log(query);
    await pool.query(query, (err,rows) =>{
      console.log(rows.ruta);
      res.render('layouts/homeGestor.hbs',{rows});
    });
});

router.post('/user', (req, res) => {
    console.log(req.body);
});

router.get('/userperfil', (req, res) => {
    res.render('layouts/homeGestorPerfil.hbs');
});

router.post('/userperfil', (req, res) => {
    console.log(req.body);
});

router.get('/gentramite', (req, res) => {
    res.render('layouts/generarTramite.hbs');
});

router.post('/gentramite', async(req, res) => {
  //console.log("req.user: ",req.user);
  //console.log("req.body: ",req.body);
  try{
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    };

    const arch = req.files.documento;

  /*##### Dummy user begins #####*/

    const userid = req.user[0].DNI;
    fs.mkdir(__dirname+`/docs/${userid}/`,(err) =>{
      if(err){
        console.log("");
      }
      //console.log("Se creó satisfactoriamente :3");
    });
    const path = __dirname+`/docs/${userid}/`;

  /*##### Dummy user ends #####*/

    arch.mv(path+arch.name,async (err) => {
      if(err){
        return res.status(500).send(err);
      }

      const archivo = {
        id_Documento:null,
        ruta:path,
        nombre:arch.name
      };

      const expediente = {
        nombre_expediente:req.body.asunto,
        numero_hojas:req.body.numFolio,
        id_Usuario:req.user[0].DNI,
        id_TipoEnte:'1',
      };

      await pool.query('INSERT INTO documento SET ?',[archivo],async (err,result,fields) => {
        //console.log("RESULT DOCUMENTO: ",result);
        await pool.query('INSERT INTO expediente SET ?',[expediente], async (err2,result2,fields2) =>{
          //console.log("RESULT EXPEDIENTE: ",result2);
          const tramite = {
            fecha:new Date().toDateString(),
            nombre_Tramite:req.body.details,
            estado:'Pendiente',
            id_Ente:result2.insertId,
            id_Movimiento:'1',
            id_TipoTramite:'1'
          };
          await pool.query('INSERT INTO tramite SET ?',[tramite], async (err3,result3,fields3) =>{
            if(err3){
              console.log(err3);
            }else{
              console.log("RESULT TRAMITE: ",result3);
            }
            const doc_ente = {
              id_Documento:result.insertId,
              id_Ente:result2.insertId
            };
            await pool.query('INSERT INTO doc_ente SET ?',[doc_ente], (err4,result4,fields4) => {
              //console.log("RESULT DOC_ENTE: ",result4);
              return res.redirect('/userperfil');
            })
          })
        })
      });
    });

  } catch(err){
    res.status(500).send(err+'error');
  }
});

router.get('/tramites', (req, res) => {
    res.render('layouts/bandejaTramitesRealizados.hbs');
});

router.post('/tramites', (req, res) => {
    console.log(req.body);
})

router.get('/about', (req,res)=>{
  res.render('layouts/about.hbs')
});

router.get('/terms', (req,res)=>{
  res.render('layouts/terms.hbs')
});

router.get('/faq', (req,res)=>{
  res.render('layouts/faq.hbs')
});

module.exports = router;
