const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const carrinho = require("../models/carrinho")
const produto = require("../models/product")
const usuario = require("../models/usuario")
const pedido = require("../models/pedido")
const item_Pedido = require("../models/itemPedido");
const item_carrinho = require('../models/itemCarrinho');

const userAuth = require("../middlewares/userAuth")



/*router.get("/carrinho/validacao" , (req, res) => {
    if( req.session.usuario === undefined){
      res.redirect('/login')
    } else {
      res.redirect("/carrinho")
    }
 }) */

 


router.get('/carrinho', (req, res) => {


    res.render('carrinho')




   // user_id = req.session.usuario.id
    //console.log(user_id);

   /* carrinho.findOne({ where: { usuarioIdUsuario: user_id} }).then((carrinhoResult) => {
        if (carrinhoResult) {
            item_carrinho.findAll({ where: { carrinhoIdCarrinho: carrinhoResult.id_carrinho } }).then((itemResult) => {
                //console.log(itemResult);
                if (itemResult && itemResult.length > 0 && itemResult[0].productIdProduto) {
                    const productIds = itemResult.map(item => item.productIdProduto);

                    produto.findAll({ where: { id_produto: productIds } }).then((produtoResult) => {
                        res.render("carrinho", { produtos: produtoResult, items: itemResult });
                    }).catch((error) => {
                        console.error("Erro ao buscar produtos:", error);
                        res.render("carrinho");
                    });
                } else {
                    console.error("productIdProduto não está definido em itemResult.");
                    res.render("carrinho", {items: undefined});
                }
            }).catch((error) => {
                
                console.error("Erro ao buscar itens do carrinho:", error);
                res.render("carrinho", {items: undefined});
            });
        } else {
            console.error("Carrinho não encontrado para o usuário.");
            res.render("carrinho", {items: undefined});
        }
    }).catch((error) => {
        console.error("Erro ao buscar carrinho:", error);
        res.render("carrinho", {items: undefined});
    }); */ 
});


module.exports = router;