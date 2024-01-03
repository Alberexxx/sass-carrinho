const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")

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
         res.redirect(`/admin/usuario/detalhes/${id}`)
      })
   }
   
})
router.post("/admin/usuario/nome", (req,res) => {
   var id = req.body.id;
   var nome = req.body.nome

   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.update({
      nome: nome
   },
      {
         where: {id_usuario: id}
      }
      ).then( () => {
         res.redirect(`/admin/usuario/detalhes/${id}`)
      })
   }
   
})
router.post("/admin/usuario/email", (req,res) => {
   var id = req.body.id;
   var email = req.body.email
   console.log('entrou na rota de email');
   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.update({
      email: email
   },
      {
         where: {id_usuario: id}
      }
      ).then( () => {
         res.redirect(`/admin/usuario/detalhes/${id}`)
      })
   }
   
})
router.post("/admin/usuario/telefone", (req,res) => {
   var id = req.body.id;
   var telefone = req.body.telefone
   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.update({
         contato_profissional: telefone
   },
      {
         where: {id_usuario: id}
      }
      ).then( () => {
         res.redirect(`/admin/usuario/detalhes/${id}`)
      })
   }
   
})
router.post("/admin/usuario/senha", (req,res) => {
   var id = req.body.id;
   var senha = req.body.senha
   var salt = bcrypt.genSaltSync(3);
   var hash = bcrypt.hashSync(senha, salt);
   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.update({
         senha: hash
   },
      {
         where: {id_usuario: id}
      }
      ).then( () => {
         res.redirect(`/admin/usuario/detalhes/${id}`)
      })
   }
   
}) 

router.post("/admin/usuario/excluir_usuario", (req,res) => {
   var id = req.body.id;
  
   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.destroy({
         where: {id_usuario: id}
      }
      ).then( () => {
         produtos.destroy({where: {id_usuario: id}}).then( () => {
            res.redirect(`/admin/usuarios`)
         })
      })
   }
   
}) 

router.get("/admin/usuario/detalhes/:id", (req,res) => {
   var id = req.params.id;

   if (id == 1){
      res.redirect('/admin/usuarios')
   } else {
      usuario.findByPk(id).then( (user) => {
         res.render('usuario', {usuario: user, empresa: user.nome})
      })
      
}
})




module.exports = router;