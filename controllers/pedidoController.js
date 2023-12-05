const express = require('express');
const router = express.Router();
const pedido = require("../models/pedido")
const userAuht = require('../middlewares/userAuth')
const item_Pedido = require("../models/itemPedido")
const carrinho = require("../models/carrinho")
const item_carrinho = require("../models/itemCarrinho")
const produto = require("../models/product")

// --------> CRUD <-------- //

//READ
router.get('/pedidos', userAuht, (req, res) => {
    var id = req.session.usuario.id
    
    pedido.findAll({ where: { usuarioIdUsuario: id } }).then(pedidos => {
        const promises = pedidos.map(pedido => {
            return item_Pedido.findAll({ where: { PedidoIdPedido: pedido.id_pedido } })
                .then(itensPedidos => {
                    return {
                        pedido: pedido,
                        itensPedidos: itensPedidos
                    };
                });
        });

        Promise.all(promises).then(results => {
            const pedidosComItens = results.map(result => {
                return {
                    pedido: result.pedido,
                    itensPedidos: result.itensPedidos
                };
            });

            const arrayDeIds = pedidosComItens.reduce((acc, current) => {
                current.itensPedidos.forEach(itemPedido => {
                    acc.push(itemPedido.productIdProduto);
                });
                return acc;
            }, []);

            produto.findAll({
                where: {
                    id_produto: arrayDeIds
                }
            }).then(produtos => {
                res.render("statusPedido", { pedidos: pedidosComItens, produtos: produtos });
            }).catch(error => {
                // Tratar erros, se houver
                console.error(error);
                res.status(500).send('Erro ao recuperar dados do banco de dados.');
            });
        }).catch(error => {
            // Tratar erros, se houver
            console.error(error);
            res.status(500).send('Erro ao recuperar dados do banco de dados.');
        });
    }).catch(error => {
        // Tratar erros, se houver
        console.error(error);
        res.status(500).send('Erro ao recuperar dados do banco de dados.');
    });
});



router.post('/finalizarPedido', (req, res) => {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const horas = data.getHours();
    const minutos = (data.getMinutes() < 10 ? '0' : '') + data.getMinutes();

    var data_realizacao = `${dia}/${mes}/${ano} às ${horas}:${minutos}`
    var pagamento = req.body.opcao;
    var endereco = req.body.cep + " | " + req.body.numero + " | " + req.body.endereco + " | " + req.body.referencia;

    var user_id = req.session.usuario.id

    carrinho.findOne({ where: { usuarioIdUsuario: user_id } })
        .then(carrinhoResult => {
            item_carrinho.findAll({ where: { carrinhoIdCarrinho: carrinhoResult.id_carrinho } })
                .then(itemResult => {
                   
                pedido.create({
                    data_realizacao: data_realizacao,
                    frete: "000",
                    status: "processando",
                    endereco: endereco,
                    formaPagamento: pagamento,
                    ValorTotal: req.body.valorTotal,
                    usuarioIdUsuario: user_id
                }).then(pedidoResult => {
                    console.log('Pedido criado com sucesso:', pedidoResult); // Adicione este log

                    if (itemResult.length > 0) {
                        const createItemPromises = itemResult.map(i => {
                            return item_Pedido.create({
                                quantidade: i.quantidade,
                                PedidoIdPedido: pedidoResult.id_pedido,
                                productIdProduto: i.productIdProduto
                            });
                        });

                        Promise.all(createItemPromises)
                            .then(() => {
                                res.redirect("/PedidoFinalizado");
                            })
                            .catch((err) => {
                                console.error('Erro ao criar os itens do pedido:', err); // Adicione este log
                                res.send("Erro ao criar os itens do pedido");
                            });
                    } else {
                        res.send("Nenhum item no carrinho encontrado");
                    }
                }).catch((err) => {
                    console.error('Erro ao criar pedido:', err); // Adicione este log
                    res.send("Erro ao criar pedido");
                });
                }).catch((err) => {
                    res.send("Erro ao encontrar itens do carrinho");
                });
        }).catch((err) => {
            res.send("Erro ao localizar o carrinho");
        }); 
});



router.get("/pedidoFinalizado", (req, res) => {
    var id = req.session.usuario.id

    carrinho.findOne({where: {usuarioIdUsuario: id}}).then( carrinho => {
         item_carrinho.destroy({
        where: {
            carrinhoIdCarrinho: carrinho.id_carrinho
        }
    }).then( () => {
        res.render("confirmacaoPedido")
    })
    })
   
})

router.get("/confirmacaoPedido" , (req, res) => {
    res.render("confirmacaoPedido")
})

router.get("/excluirItems" , (req, res) => {

    item_carrinho.destroy({
        where: {
            carrinhoIdCarrinho: 6
        }
    }).then( () => {
        res.render("pagamento")
    })

})


module.exports = router;