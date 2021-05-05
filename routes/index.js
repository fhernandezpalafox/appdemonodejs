var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment =  require('moment');

const mysqlConnection  = require('../db/database.js');
const { checkToken } = require('../middleware.js');

require('dotenv').config();


//Creación del Token expira en 10 horas
const createToken = (user) => {
  let payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiresAt: moment().add(10,'hours').unix()
  }
  return jwt.encode(payload,process.env.TOKEN_KEY);
};

router.post('/autenticacion', async function(req, res, next) {


  const { correo, password } = req.body; 
  mysqlConnection.query('SELECT * FROM tbl_usuarios where correo = ?', [correo], (err, rows, fields) => {
    if (!err) {
      var user = rows[0];

      console.log(user);

      if(user === undefined){
        res.json({
          error:'Error, usuario y/o contraseña incorrectos',
          numero:'001'
        })
      }else {

        const equals  =  bcrypt.compareSync(password,user.password);
         
        if(!equals){
          res.json({
            error:'Error, usuario y/o contraseña incorrectos',
            numero:'002'
          });
        }else {
          res.json({
            succesfull: createToken(user),
            done:'Login Correcto',
            numero:'003',
            nombre: user.nombre,
            edad: user.edad,
          });
        }

      }

    } else {
      console.log(err);
    }
  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/usuarios', function(req, res, next) {
  mysqlConnection.query('SELECT * FROM tbl_usuarios', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  }); 
});


router.get('/usuarios/:id', checkToken, (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM tbl_usuarios where id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});


router.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM tbl_usuarios WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario eliminado'});
    } else {
      console.log(err);
    }
  });
});

router.post('/usuarios', (req, res) => {
  const {nombre, apellidos, edad, correo , password} = req.body;
  var pass = bcrypt.hashSync(password,10);  
  const query = `insert into tbl_usuarios(nombre,apellidos,edad,correo,password) values(?,?,?,?,?) `;
  mysqlConnection.query(query, [nombre, apellidos, edad, correo , pass], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario Guardado'});
    } else {
      console.log(err);
    }
  });

});


router.put('/usuarios/:id', (req, res) => {
  const {nombre, apellidos, edad, correo , password} = req.body;
  const { id } = req.params;
  var pass = bcrypt.hashSync(password,10);  
  const query = `update tbl_usuarios set nombre = ?, apellidos = ?, edad= ?, correo=?, password=? where id = ?`;
  mysqlConnection.query(query, [nombre, apellidos, edad, correo , pass,id], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario modificado'});
    } else {
      console.log(err);
    }
  });
});





module.exports = router;
