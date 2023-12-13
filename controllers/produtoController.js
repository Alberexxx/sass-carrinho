const express = require('express');
const router = express.Router();
const product = require("../models/product")
const slugify = require("slugify")
const multer = require("multer")
const { Op } = require('sequelize'); 
const Sequelize = require("sequelize")

const adminAuth = require("../middlewares/adminAuth");
const userAuth = require("../middlewares/userAuth")
const usuario = require('../models/usuario');


//multer

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/produtos" , (req, res) => {
    product.findAll().then( produtos => {
            res.render("todosProdutos", {produtos: produtos})

    })
})

router.get("/:empresa/detalhes/:id/:slug", (req, res) => {
    
    var slug = req.params.slug
    var empresa = req.params.empresa
    const Op = Sequelize.Op
    var idSession = req.session.usuario ? req.session.usuario.id : undefined;
    
    usuario.findOne({where: {nome: empresa}}).then((userResult) => {
        product.findOne({where: {slug: slug}}).then( produto => {
        if(produto !== undefined){
            
            product.findAll({
                where: {
                    id_usuario: userResult.id_usuario,  status: { [Op.not]: ['oculto', 'indisponivel']} 
                },
                order: Sequelize.literal('rand()'),
                limit: 4
            
            }).then( produtosRelacionados => {
                    res.render("detalhesProduto", {produto: produto, produtosRelacionados: produtosRelacionados, empresa: empresa, tema: userResult.corTema, logo: userResult.logo, instagram: userResult.instagram, numero: userResult.telefone, empresa: userResult.nome, mimetype: userResult.foto, idSession: idSession, empresaId: userResult.id_usuario})
                })
                

            } else {
                res.redirect("home")
            }
        })
    })
    
})



// Rota de busca

router.post('/pesquisar', (req, res) => {
    var idSessao = req.session.usuario ? req.session.usuario.id : undefined;
    const valor = req.body.pesquisa;
    var empresaId = req.body.empresaId
    var empresa = req.body.empresa
    var instagram = req.body.instagram
    var numero = req.body.numero
    var tema = req.body.tema
    product.findAll({
        where: {
            nome_produto: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('nome_produto')), 'LIKE', '%' + valor.toLowerCase() + '%')
                ]
            }, 
            id_usuario: empresaId           
        }
    }).then(produtosFiltrados => {
        res.render("index", { produtos: produtosFiltrados, pesquisa: valor , idSessao: idSessao, empresaId: empresaId, empresa: empresa, instagram: instagram, numero: numero, tema: tema});
    }).catch(error => {
        console.error('Erro na busca:', error);
        res.status(500).send('Erro na busca de produtos');
    });
});

router.get('/admin/addProduto', userAuth, (req, res) => {
    id = req.session.usuario.id
    usuario.findByPk(id).then( (userResult) => {
        res.render("addProduto", { empresa: userResult.nome})

    })
 })

// --------> CRUD <-------- //

//READ
router.get('/admin/produtos', userAuth ,(req, res) => {
    var id_usuario = req.session.usuario.id

    usuario.findByPk( id_usuario).then( (userResult => {
         product.findAndCountAll({where: {id_usuario: id_usuario}}).then((produtosResult) => {
        res.render('produtos', {produtos: produtosResult.rows, produtosCadastrados: produtosResult.count, limite: userResult.limite_produtos, empresa: userResult.nome})

    }).catch((err) => {
        res.send(err)
    })
    }))
   
})


//CREATE
router.post('/produtos/save', upload.fields([{name: 'foto', maxCount: 1}, {name: 'foto2', maxCount: 1}]), (req, res) => {
   var nome_produto = req.body.nome
   var preco = req.body.preco
   var descricao = req.body.descricao
   var tamanho = req.body.tamanho
   var modelo = req.body.modelo
   var cor = req.body.cor
   var categoria = req.body.categoria
   //var estoque = req.body.estoque
   var id_usuario = req.session.usuario.id
   var marca = req.body.marca
   var status = req.body.status
   

  /*if (!req.file) {

    return res.status(400).send('Nenhum arquivo enviado');
  } */

   //var { originalname, mimetype, buffer } = req.file;
   //var { originalname2, mimetype2, buffer2 } = req.file;

    var foto = req.files['foto'] ? {
        originalname: req.files['foto'][0].originalname,
        mimetype: req.files['foto'][0].mimetype,
        buffer: req.files['foto'][0].buffer,
    } : null;

    var foto2 = req.files['foto2'] ? {
        originalname: req.files['foto2'][0].originalname,
        mimetype: req.files['foto2'][0].mimetype,
        buffer: req.files['foto2'][0].buffer,
    } : null;

    if ( foto == null && foto2 != null ) {
        foto = foto2;
        foto2 = null
    }


   usuario.findByPk( id_usuario).then( (userResult => { 
        product.findAndCountAll({
        where: {id_usuario: id_usuario}
        })
        .then( produtosResult => {
                if (produtosResult.count < userResult.limite_produtos) {
                    var { originalname: originalname, mimetype: mimetype, buffer: buffer } = foto || {};
                    var { originalname: originalname2, mimetype: mimetype2, buffer: buffer2 } = foto2 || {};

                    product.create({
                        nome_produto: nome_produto,
                        preco: preco,
                        descricao: descricao,
                        tamanho: tamanho,
                        modelo: modelo,
                        cor: cor, 
                        nome_categoria: categoria,
                        originalname: originalname,
                        mimetype: mimetype,
                        foto: buffer,

                        originalname2: originalname2,
                        mimetype2: mimetype2,
                        foto2: buffer2,

                        slug: slugify(nome_produto),
                        id_usuario: id_usuario,
                        marca: marca,
                        status: status    
                                        
                    }).then(() => {
                    
                        res.redirect('/admin/produtos')
                    
                    
                    }).catch((err) => {
                        res.send(err)
                    })
                } else {
                    res.redirect('/admin/produtos')
                }
        })
   }))
   

  
})

//teste
router.get('/imagem/:id', (req, res) => {
    
    product.findByPk(req.params.id).then(produto => {

        res.setHeader('Content-Type', produto.mimetype);
        res.send(produto.foto);

    })

  });

router.get('/imagem2/:id', (req, res) => {

product.findByPk(req.params.id).then(produto => {

    res.setHeader('Content-Type', produto.mimetype2);
    res.send(produto.foto2);

})

});



router.post("/admin/produtos/deletar", (req,res) => {
    var id = req.body.id;

    if (id != undefined ) {

        if(!isNaN(id)){

            product.destroy({
                where: {
                    id_produto:id
                }
            }).then(() => {
                res.redirect("/admin/produtos")
            })


        }else {
            res.redirect("/admin/categories")
        }

    } else {
    }
})

router.post("/admin/editar-produto", userAuth, (req, res) => {
    var id = req.body.id
    var empresa = req.body.empresa

    product.findOne({where: {id_produto: id}}).then(produto => {
        res.render("produtoEdit", {produto: produto, empresa: empresa})
    })
})

   

router.post('/admin/produto/edit/env', upload.fields([{name: 'foto', maxCount: 1}, {name: 'foto2', maxCount: 1}]), (req, res) => {
    var id = req.body.id
    var nome_produto = req.body.nome
    var preco = req.body.preco
    var descricao = req.body.descricao
    var tamanho = req.body.tamanho
    var modelo = req.body.modelo
    var cor = req.body.cor
    var categoria = req.body.categoria
    
    var foto = req.files['foto'] ? {
        originalname: req.files['foto'][0].originalname,
        mimetype: req.files['foto'][0].mimetype,
        buffer: req.files['foto'][0].buffer,
    } : null;

    var foto2 = req.files['foto2'] ? {
        originalname: req.files['foto2'][0].originalname,
        mimetype: req.files['foto2'][0].mimetype,
        buffer: req.files['foto2'][0].buffer,
    } : null;

    var marca = req.body.marca
    var status = req.body.status

    var { originalname: originalname, mimetype: mimetype, buffer: buffer } = foto || {};
    var { originalname: originalname2, mimetype: mimetype2, buffer: buffer2 } = foto2 || {}
    
    product.update({
        nome_produto: nome_produto,
        preco: preco,
        descricao: descricao,
        tamanho: tamanho,
        modelo: modelo,
        cor: cor, 
        nome_categoria: categoria,

        originalname: originalname,
        mimetype: mimetype,
        foto: buffer,

        originalname2: originalname2,
        mimetype2: mimetype2,
        foto2: buffer2,

        marca: marca,
        status: status,
        slug: typeof nome_produto === 'string' ? slugify(nome_produto) : null
    },
        { where: {
            id_produto: id
        }
    
        }).then(() => {
       
        res.redirect('/admin/produtos')
    
       
       }).catch((err) => {
        res.send(err)
       })

})



module.exports = router;