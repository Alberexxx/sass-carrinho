const express = require('express');
const router = express.Router();
const item = require("../models/itemCarrinho");
const usuario = require('../models/usuario');
const carrinho = require("../models/carrinho");
const item_carrinho = require('../models/itemCarrinho');


// --------> CRUD <-------- //

//add produto pelo pagina do produto
router.get('/addItem/:preco/:quantidade/:id_produto', (req, res) => {

     var id_produto =   7  //req.body.id_produto
     var preco_unitario = req.params.preco
     var quantidade = req.params.quantidade

     var id =  6   //req.session.usuario.id
   // var id_produto = req.body.id_produto
    //var preco_unitario = req.body.preco
   // var quantidade = req.body.quantidade

    carrinho.findOne({where: {usuarioIdUsuario: id}}).then( carrinho => {
       item.create({
            quantidade: quantidade,
            preco_unitario: preco_unitario,
            carrinhoIdCarrinho: carrinho.id_carrinho,
            productIdProduto: id_produto

       }).then(() => {
            res.send("OK")
       }).catch(() => {

       })
    })
})

//add produto no carrinho pela home
router.post('/addItemCarrinho', (req, res) => {

    var id_produto =  req.body.idProduto
    var preco_unitario = req.body.preco
    var quantidade = 1

    

     if(req.session.usuario === undefined) {
          res.send('false')
     } else {
          var id = req.session.usuario.id
          carrinho.findOne({where: {usuarioIdUsuario: id}}).then( carrinho => {
          item.create({
               quantidade: quantidade,
               preco_unitario: preco_unitario,
               carrinhoIdCarrinho: carrinho.id_carrinho,
               productIdProduto: id_produto

          }).then(() => {
               res.send('true')
          }).catch(() => {

          })
     })
     }
})

router.post("/removeItem", (req, res) => {
     var id = req.body.idItem
     console.log(id);
     
     item_carrinho.destroy({where: {id_item: id}}).then( item => {
          res.send("ok")
     })
})

router.post('/mudarQuantidade', (req,res) => {
     var id = req.body.idItem;
     var qtd = req.body.qtd
     item.findOne({where: {id_item: id}}).then( item => {
          
          newQuantidade = qtd + item.quantidade
          item.update({quantidade: newQuantidade}, {
               where: {
                    id_item: id
               }}).then( i => {
                    res.send("ok")
               })

     })
    
})




module.exports = router;