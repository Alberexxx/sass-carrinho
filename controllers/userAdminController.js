const express = require('express');
const router = express.Router();
const userAdmin = require("../models/userAdmin")
const pedidos = require("../models/pedido")
const produtos = require("../models/product")

const adminAuth = require("../middlewares/adminAuth");
const usuario = require('../models/usuario');

// --------> CRUD <-------- //

//READ


router.get('/admin/usuarios', adminAuth, (req, res) => {
   var id = req.session.usuario.id
   usuario.findByPk(id).then( (user) => {
      usuario.findAll().then( (userResult) => {
      res.render('usuarios', {usuarios: userResult, empresa: user.nome})
   })
   })
   
})

router.post("/admin/usuarios/situacao", (req,res) => {
   var id = req.body.id;
   var situacao = req.body.situacao

   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.update({
      situacao: situacao
   },
      {
         where: {id_usuario: id}
      }
      ).then( () => {
         res.redirect('/admin/usuarios')
      })
   }
   
})




module.exports = router;