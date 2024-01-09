const express = require('express');
const router = express.Router();
const product = require("../models/product")
const slugify = require("slugify")
const multer = require("multer")
const { Op } = require('sequelize'); 
const Sequelize = require("sequelize")
const sharp = require("sharp")
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
    var id_produto = req.params.id
    var empresa = req.params.empresa
    const Op = Sequelize.Op
    var idSession = req.session.usuario ? req.session.usuario.id : undefined;
    
    usuario.findOne({where: {nome: empresa}}).then((userResult) => {
        product.findOne({where: {id_produto: id_produto}}).then( produto => {
        if(produto !== undefined){
            
            product.findAll({
                where: {
                    id_usuario: userResult.id_usuario,  status: { [Op.not]: ['oculto', 'indisponivel']} 
                },
                order: Sequelize.literal('rand()'),
                limit: 4
            
            }).then( produtosRelacionados => {
                if (userResult.taxas === null) {
                    
                    userResult.taxas = {
                        "taxas": {
                            "avista": {
                                "taxa": false,
                                "valor": []
                            },
                            "credito": {
                                "taxa": [],
                                "valores": {}
                            },
                            "debito": {
                                "taxa": [],
                                "valor": {}
                            }
                        }

                    }
                }
                    res.render("detalhesProduto", {produto: produto, produtosRelacionados: produtosRelacionados, empresa: empresa, tema: userResult.corTema, logo: userResult.logo, instagram: userResult.instagram, numero: userResult.telefone, empresa: userResult.nome, mimetype: userResult.foto, idSession: idSession, empresaId: userResult.id_usuario, enderecoLoja: userResult.enderecoLoja, contato: userResult.contato, horario: userResult.horario, taxas: userResult.taxas})
                })
                

            } else {
                res.redirect("home") 
            }
        })
    })
    
})



// Rota de busca

router.get('/pesquisar', (req, res) => {
    
    var idSessao = req.session.usuario ? req.session.usuario.id : undefined;
    var valor = req.query.pesquisa;
    var empresa = req.query.empresa

    if (valor == '') {
        res.redirect(`/${empresa}`)
    } else {
        usuario.findOne({
        where: {nome: empresa}
    }).then( (userResult) => {
         product.findAll({
        where: {
            nome_produto: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('nome_produto')), 'LIKE', '%' + valor.toLowerCase() + '%')
                ]
            }, 
            id_usuario: userResult.id_usuario          
        }
    }).then(produtosFiltrados => {

        if (userResult.taxas === null) {
                    
            userResult.taxas = {
                "taxas": {
                    "avista": {
                        "taxa": false,
                        "valor": []
                    },
                    "credito": {
                        "taxa": [],
                        "valores": {}
                    },
                    "debito": {
                        "taxa": [],
                        "valor": {}
                    }
                }

            }
        }
        res.render("index", { produtos: produtosFiltrados, pesquisa: valor , idSessao: idSessao, empresaId: userResult.empresaId, empresa: userResult.nome, instagram: userResult.instagram, numero: userResult.numero, tema: userResult.corTema, enderecoLoja: userResult.enderecoLoja, contato: userResult.contato, horario: userResult.contato, taxas: userResult.taxas});
    }).catch(error => {
        console.error('Erro na busca:', error);
        res.status(500).send('Erro na busca de produtos');
    });
    })
   
    }
    
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
         product.findAndCountAll({where: {id_usuario: id_usuario}, order: [['createdAt', 'DESC']]}).then((produtosResult) => {
        res.render('produtos', {produtos: produtosResult.rows, produtosCadastrados: produtosResult.count, limite: userResult.limite_produtos, empresa: userResult.nome})

    }).catch((err) => {
        res.send(err)
    })
    }))
   
})


//CREATE
router.post('/produtos/save', upload.fields([{name: 'foto', maxCount: 1}, {name: 'foto2', maxCount: 1}]), userAuth,(req, res) => {
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
   
   preco = preco.replace('R$','')
   preco = preco.replace(/,/g, ('.'))

   
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


    //------------- comprimir imagem ---------------
    const processarImagem = async (imagem, tamanhoMaximoKB) => {
        if (!imagem) {
            return null;
        }
    
        const tamanhoMaximoBytes = tamanhoMaximoKB * 1024;
        const resolucaoAlvo = 800;
    
        try {
            let buffer;
            let qualidade = 100;
    
            console.log('Iniciando processamento de imagem...');
    
            buffer = await sharp(imagem.buffer)
                .resize({ 
                    width: resolucaoAlvo,
                    height: resolucaoAlvo,
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                 })
                .toFormat('webp', { quality: qualidade })
                .toBuffer();
    
            console.log('Imagem processada com qualidade inicial:', qualidade);
            
            // Iterativamente reduzir a qualidade até atender ao requisito de tamanho
            while (buffer.length > tamanhoMaximoBytes && qualidade > 0) {
                qualidade -= 10;
    
                console.log('Reduzindo qualidade para:', qualidade);
    
                if (qualidade > 0) {
                    // Evitar processamento adicional se a qualidade atingir zero
                    buffer = await sharp(buffer)
                        .toFormat('webp', { quality: qualidade })
                        .toBuffer();
                }
            }
    
            console.log('Processamento de imagem concluído.');
    
            return buffer.length <= tamanhoMaximoBytes ? buffer : null;
        } catch (error) {
            console.error('Erro ao processar a imagem:', error);
            return null;
        }
    };
    
    
    // Uso da função processarImagem
    const tamanhoMaximoKB = 100; // Ajuste conforme necessário
    const fotoProcessadaPromise = processarImagem(foto, tamanhoMaximoKB);
    const foto2ProcessadaPromise = processarImagem(foto2, tamanhoMaximoKB);

    
    
    // Esperar pela resolução das Promises antes de continuar
    Promise.all([fotoProcessadaPromise, foto2ProcessadaPromise])
        .then(([fotoProcessada, foto2Processada]) => {
            if (fotoProcessada) {
                foto.buffer = fotoProcessada;
            }
    
            if (foto2Processada) {
                foto2.buffer = foto2Processada;
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
                                foto: foto.buffer,
        
                                originalname2: originalname2,
                                mimetype2: mimetype2,
                                foto2: foto2 == null ? null : foto.buffer ,
        
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
        .catch((error) => {
            // Lidar com erros, se necessário
            console.error('Erro ao processar as imagens:', error);
        });
    
    //----------------------------------------------

   
   

  
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

   

router.post('/admin/produto/edit/env', userAuth, upload.fields([{name: 'foto', maxCount: 1}, {name: 'foto2', maxCount: 1}]), (req, res) => {
    var id = req.body.id
    var nome_produto = req.body.nome
    var preco = req.body.preco
    var descricao = req.body.descricao
    var tamanho = req.body.tamanho
    var modelo = req.body.modelo
    var cor = req.body.cor
    var categoria = req.body.categoria
    var marca = req.body.marca
    var status = req.body.status

    preco = preco.replace('R$','').trim();
    preco = preco.replace(/,/g, ('.'))

    console.log(preco);
    
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

  //------------------------------------------------------------
 

//------------- comprimir imagem ---------------
var processarImagem = async (imagem, tamanhoMaximoKB) => {
    if (!imagem) {
        return null;
    }

    const tamanhoMaximoBytes = tamanhoMaximoKB * 1024;
    const resolucaoAlvo = 800;

    try {
        let buffer;
        let qualidade = 100;

        console.log('Iniciando processamento de imagem...');

        buffer = await sharp(imagem.buffer)
            .resize({ 
                width: resolucaoAlvo,
                height: resolucaoAlvo,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
             })
            .toFormat('webp', { quality: qualidade })
            .toBuffer();

        console.log('Imagem processada com qualidade inicial:', qualidade);
        
        // Iterativamente reduzir a qualidade até atender ao requisito de tamanho
        while (buffer.length > tamanhoMaximoBytes && qualidade > 0) {
            qualidade -= 10;

            console.log('Reduzindo qualidade para:', qualidade);

            if (qualidade > 0) {
                // Evitar processamento adicional se a qualidade atingir zero
                buffer = await sharp(buffer)
                    .toFormat('webp', { quality: qualidade })
                    .toBuffer();
            }
        }

        console.log('Processamento de imagem concluído.');

        return buffer.length <= tamanhoMaximoBytes ? buffer : null;
    } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        return null;
    }
};


// Uso da função processarImagem
var tamanhoMaximoKB = 100; // Ajuste conforme necessário

var fotoProcessadaPromise = processarImagem(foto, tamanhoMaximoKB);
var foto2ProcessadaPromise = processarImagem(foto2, tamanhoMaximoKB);


Promise.all([fotoProcessadaPromise, foto2ProcessadaPromise])
    .then(([fotoProcessada, foto2Processada]) => {
        if (fotoProcessada) {
            foto.buffer = fotoProcessada;
        }

        if (foto2Processada) {
            foto2.buffer = foto2Processada;
        } 

        

        var { originalname: originalname, mimetype: mimetype, buffer: buffer } = foto || {};
        var { originalname: originalname2, mimetype: mimetype2, buffer: buffer2 } = foto2 || {};

        if (foto2 === null) {
            originalname2 = mimetype2 = buffer2 = null
        } else {

        }

        console.log(originalname2, mimetype2, buffer2);

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
    .catch((error) => {
        // Lidar com erros, se necessário
        console.error('Erro ao processar as imagens:', error);
    });

 //------------------------------------------------------------

    
   

})



module.exports = router;