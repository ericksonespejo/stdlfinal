const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');
const axios = require('axios');

passport.use('local.signin', new Strategy({
    usernameField: 'DNI',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, DNI, password, done) => {
    await pool.query('SELECT * FROM usuario WHERE DNI = ?', [DNI], async(err, rows) => {
        try {
            if (rows.length > 0) {
                const user = rows[0];
                const validpassword = await helpers.matchPassword(password, user.contrasena);
                if(validpassword){
                    done(null,user)
                }else{
                    done(null,false);
                    console.log('Contraseña incorrecta');
                }
            }else{
                return done(null,false);
                console.log('Usuario incorrecto');
            }
        } catch (err) {
            console.log(err);
        }
    });

}));

passport.use('local.signup', new Strategy({
    usernameField: 'DNI',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async(req, DNI, password, done) => {
    const {phone, email, distrito, provincia, calle} = req.body;
    RUTA = `https://apistdl.herokuapp.com/dates?DNI=${DNI}`

    try{
      const res = await axios.get(RUTA);
      const user = {
          DNI,
          nombre: res.data.nombres,
          correo: email,
          telefono: phone,
          distrito,
          provincia,
          calle,
          contrasena: password,
          apellido_paterno: res.data.apellidoPaterno,
          apellido_materno: res.data.apellidoMaterno,
      };
      user.contrasena = await helpers.encryptPassword(password);
      await pool.query('INSERT INTO usuario set ?', [user]);
      return done(null, DNI);
    }catch(err){
      console.log(err);
    }
}));

passport.use('local.signupemp', new Strategy({
    usernameField: 'DNI',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async(req, DNI, password, done) =>{
    const {correo, id_Depto} = req.body;
    RUTA = `https://apistdl.herokuapp.com/dates?DNI=${DNI}`

    try{
        const res = await axios.get(RUTA);        
        const empleado = {
            DNI,
            nombre: res.data.nombres,
            apellido_paterno: res.data.apellido_paterno,
            apellido_materno: res.data.apellido_materno,
            correo,
            contrasena: password,            
            id_Depto
        }
    }catch (err) {
        console.log(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async(DNI, done) => {
    await pool.query('SELECT * FROM usuario WHERE DNI = ?', [DNI.DNI], (err, rows) => {
        if (err) {
            console.log(err);
        }
        //const user = rows[0];
        done(null, rows);
    });
})
