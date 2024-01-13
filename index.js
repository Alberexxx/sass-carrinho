const express = require("express");
const app = express();
const connection = require('./database/connection')
const session = require("express-session")
const Sequelize = require("sequelize")
const { Op } = require('sequelize'); 

/*  ----------- DESCOMENTAR ISSO NO SERVIDOR ------------  ***talvez seja necessario instalar as bibliotecas  {npm install http https fs express-sslify}
const http = require('http');
const https = require('https');
const fs = require('fs');
const enforce = require('express-sslify');

const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/meucarrinhofacil.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/meucarrinhofacil.com/fullchain.pem'),
};

app.use(enforce.HTTPS({ trustProtoHeader: true }));

*/



app.use(express.urlencoded({ extended: true })); // Para analisar dados de formulário
app.use(express.json()); //Para analisar dados JSON

//session
app.use(
    session({
    secret: "aojd5emfe2cmckeol78dsnkkzmajqnuwbuw",
    cookie: { maxAge: 4320000}
}))





//import dos models
const produto = require('./models/product')
const usuario = require('./models/usuario')
const userAdmin = require('./models/userAdmin')
const pedido = require('./models/pedido')
const comentario_produto = require('./models/comentario_produto')
const categoria = require('./models/categoria')
const carrinho = require('./models/carrinho')
const avaliacao_site = require('./models/usuario')
const endereco = require('./models/endereco')
const item_carrinho = require('./models/itemCarrinho')
const item_Pedido = require('./models/itemPedido')





//import dos controllers
const productController = require('./controllers/produtoController')
const avaliacao_siteController = require('./controllers/avaliacao_siteController')
const carrinhoController = require('./controllers/carrinhoController')
const categoriaController = require('./controllers/categoriaController')
const usuarioController = require('./controllers/usuarioController')
const comentario_produtoController = require('./controllers/comentario_produtoController')
const userAdminController = require('./controllers/userAdminController')
const pedidoController = require('./controllers/pedidoController')
const enderecoController = require('./controllers/enderecoController')
const pagamentoController = require("./controllers/pagamentoController")
const loginController = require("./controllers/loginController")
const itemCarrinho = require("./controllers/itemCarrinhoController")



//view engine
app.set('view engine', 'ejs')

//diretorio padrao para busca de arquivos estaticos
app.use(express.static('public'))


//database
connection
    .authenticate()
    .then(() => {
        console.log('conexão estabelecida com sucesso');
    }).catch((err) => {
        console.log(err);
    })

//utilizacao dos roteadores
app.use('/', usuarioController)
//app.use('/', avaliacao_siteController)
app.use('/', carrinhoController)
app.use('/', categoriaController)
//app.use('/', comentario_produtoController)
app.use('/', pedidoController)
app.use('/', productController)
app.use('/', userAdminController)
//app.use('/', enderecoController)
app.use("/", pagamentoController)
app.use("/", loginController)
app.use("/", itemCarrinho)



app.use('/favicon.ico', (req, res) => res.status(204));

// Rotas


app.get("/aba",(req, res) => {
    res.render("abaCarrinho")
});

app.get("/:empresa",(req, res) => {
    var empresa = req.params.empresa
    var limite = 25;
    var pagina = 0;
    usuario.findOne({where: {nome: empresa}}).then((userResult) => {

      if ( userResult.situacao == 'bloqueado' ) {
        res.render('home')
      } else { 

        if ( req.session.usuario != undefined) {
            var idSessao = req.session.usuario.id
            
            produto.findAndCountAll({where: {id_usuario: userResult.id_usuario,  status: { [Op.not]: 'oculto'} } , 
                order: Sequelize.literal('rand()'),
                limit: limite
            }).then( (produtoResult) => {
                
                var next;
                if (produtoResult.count <= limite) {
                    next = false;
                    
                } else {
                    next = true;
                }
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

                
                res.render("index", {limite: limite, count: produtoResult.count, pagina: pagina, next: next, produtos: produtoResult.rows, empresa: userResult.nome, tema: userResult.corTema, instagram: userResult.instagram, logo: userResult.logo, numero: userResult.telefone,  mimetype: userResult.foto, idSessao: idSessao, empresaId : userResult.id_usuario, pesquisa: undefined, horario: userResult.horario, contato: userResult.contato, enderecoLoja: userResult.enderecoLoja, taxas: userResult.taxas})
            })
        } else {
            produto.findAndCountAll({where: {id_usuario: userResult.id_usuario, status: { [Op.not]: 'oculto'} } ,
                order: Sequelize.literal('rand()'),
                limit: limite
            }).then( (produtoResult) => {
                var next;
                if (produtoResult.count <= limite) {
                    next = false;
                    
                } else {
                    next = true;
                }

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
                res.render("index", {limite: limite, count: produtoResult.count, pagina: pagina, next: next, produtos: produtoResult.rows, empresa: userResult.nome, tema: userResult.corTema, instagram: userResult.instagram, logo: userResult.logo, numero: userResult.telefone,  mimetype: userResult.foto, empresaId : userResult.id_usuario,  idSessao: undefined, pesquisa: undefined, horario: userResult.horario, contato: userResult.contato, enderecoLoja: userResult.enderecoLoja, taxas: userResult.taxas})
             })
        }
    
   }}).catch((err) => {
        res.send(err)
    })
   
});
// paginacao -----------------------
app.get("/:empresa/page/:num",(req, res) => {
    var empresa = req.params.empresa
    var page = req.params.num;
    var offset = 0; 
    var limite = 25;

    if (isNaN(page) || page == 1 || page < 0) {
        offset = 0;
        
    } else {
        offset = (parseInt(page) -1) * limite ;
    }
    

    usuario.findOne({where: {nome: empresa}}).then((userResult) => {

      if ( userResult.situacao == 'bloqueado' ) {
        res.render('home') 
      } else { 
        var pagina = parseInt(page)

        if ( req.session.usuario != undefined) {
            var idSessao = req.session.usuario.id
            produto.findAndCountAll({
                where: {id_usuario: userResult.id_usuario,  status: { [Op.not]: 'oculto'} } , 
                limit: limite ,
                offset: offset,
                order: [['createdAt', 'DESC']]
            }).then( (produtoResult) => {

                var next;
                if (offset + limite >= produtoResult.count) {
                    next = false;
                    
                } else {
                    next = true;
                }
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
                
                res.render("index", {limite: limite, count: produtoResult.count, pagina: pagina, next: next, produtos: produtoResult.rows, empresa: userResult.nome, tema: userResult.corTema, instagram: userResult.instagram, logo: userResult.logo, numero: userResult.telefone,  mimetype: userResult.foto, idSessao: idSessao, empresaId : userResult.id_usuario, pesquisa: undefined, horario: userResult.horario, contato: userResult.contato, enderecoLoja: userResult.enderecoLoja, taxas: userResult.taxas})
            })
        } else {
            produto.findAndCountAll({
                where: {id_usuario: userResult.id_usuario, status: { [Op.not]: 'oculto'} } ,
                limit: limite ,
                offset: offset,
                order: [['createdAt', 'DESC']]
            }).then( (produtoResult) => {
                var next;
                if (offset + limite >= produtoResult.count) {
                    next = false;
                    
                } else {
                    next = true; 
                }
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
                res.render("index", {limite: limite, count: produtoResult.count, pagina: pagina, next: next, produtos: produtoResult.rows, empresa: userResult.nome, tema: userResult.corTema, instagram: userResult.instagram, logo: userResult.logo, numero: userResult.telefone,  mimetype: userResult.foto, empresaId : userResult.id_usuario,  idSessao: undefined, pesquisa: undefined, horario: userResult.horario, contato: userResult.contato, enderecoLoja: userResult.enderecoLoja, taxas: userResult.taxas})
             })
        }
     
   }}).catch((err) => {
        res.send(err)
    })
   
});


/*  --------------------------------- configuracao de redirecionamento para o https --------------------------------- descomentar
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
    res.end();
});

httpServer.listen(80, () => {
    console.log('Servidor HTTP para redirecionamento está ouvindo na porta 80');
});


const server = https.createServer(sslOptions, app);

server.listen(443, () => {
  console.log(`Servidor Express com SSL está ouvindo na porta 443`);
});

*/



// ========================== servidor de producao ================================= comentar

app.listen(8080,() => {
    console.log("Servidor rodando"); 
});
