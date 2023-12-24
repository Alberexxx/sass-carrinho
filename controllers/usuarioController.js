const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")
const usuario = require("../models/usuario")
const carrinho = require("../models/carrinho")
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userAuth = require("../middlewares/userAuth")


router.use(express.json()); //Para analisar dados JSON


// --------> CRUD <-------- //

//READ


router.get("/perfil", userAuth ,(req, res) => {
  var id = req.session.usuario.id
  usuario.findOne({where: {id_usuario: id}}).then( user => {
      res.render("perfil", {usuario: user})
  })
})




//rota de re_redirecionamento para a home



router.post('/login/create', (req, res) => {
  var email = req.body.email;
  var senha = req.body.senha;
  var nome = req.body.nome;

  usuario.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(3);
      var hash = bcrypt.hashSync(senha, salt);

      usuario
        .create({
          email: email,
          senha: hash,
          nome: nome,
          situacao: 'em dia',
          limite_produtos: 50
        })
        .then((usuario) => {
          carrinho.create({
            usuarioIdUsuario: usuario.id_usuario,
          }).then(() => {
            req.session.usuario = {
              id: usuario.id_usuario,
              email: usuario.email,
              nome: usuario.nome
            }
            res.redirect('/admin/produtos');
          });
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.redirect(
        `/login?mensagem=${encodeURIComponent(
          'Já existe um cadastro com esse email, tente usar outro.'
        )}`
      );
    }
  });
});

router.post('/admin/usuario/limite' , (req, res) => {
  var id = req.body.id
  var newlimite = req.body.limite
  usuario.update({
    limite_produtos: newlimite
  }, {
    where: {id_usuario: id}
  }).then( () => {
    res.redirect('/admin/usuario/detalhes/' + id )
  })


})
router.post('/admin/usuario/mensalidade' , (req, res) => {
  var id = req.body.id
  var newMensalidade = req.body.mensalidade
  usuario.update({
    mensalidade: newMensalidade
  }, {
    where: {id_usuario: id}
  }).then( () => {
    res.redirect('/admin/usuario/detalhes/' + id )
  })


})


router.get("/redirect", (req, res) => {
    res.redirect("/re-redirect")
})

router.get("/re-redirect", (req,res) => {
    res.redirect("login")
})


router.get('/ajax', (req, res) => {
  res.render('ajax')
})


router.post('/sua-endpoint-aqui', (req, res) => {
  var mensagemId = req.body.inputId;

  res.send(mensagemId);
});

router.post('/validaEmail', (req, res) => {
  var email = req.body.inputId;

  usuario.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) { 
      res.send("")
    } else {
      res.send("o email já está em uso.")
    }
  })

})
router.get('/admin/configuracoes', userAuth, (req, res) => {
  var usuario_id = req.session.usuario.id
  usuario.findOne({where: {id_usuario: usuario_id}}).then( (userResult) => {
    res.render('configuracoes', {usuario: userResult, empresa: userResult.nome})
  })
})

router.post("/admin/configuracoes/edit",upload.single('logo'), (req, res) => {

  let taxas = JSON.parse(req.body.json_data)

  var id_usuario = req.session.usuario.id
  var tema = req.body.tema; 
  var numero = req.body.numero;
  var instagram = req.body.instagram
  var endereco = req.body.endereco
  var horario = req.body.horario
  var contato = req.body.contato
  var { originalname, mimetype, buffer } = req.file ?? {};

  usuario.update({
    corTema: tema,
    instagram: instagram ,
    telefone: numero,
    logo: buffer ,
    foto: mimetype,
    enderecoLoja: endereco,
    contato: contato,
    horario: horario,
    taxas: taxas
},
    { where: {
      id_usuario: id_usuario
    }

    }).then(() => {
   
    res.redirect('/admin/produtos')
   
   }).catch((err) => {
    res.send(err)
   })

})
router.get('/logo/:empresa', (req, res) => {
    var empresa = req.params.empresa
    console.log(empresa);
  usuario.findOne({where: {nome: empresa}}).then(userResult => {

      res.setHeader('Content-Type', userResult.foto);
      res.send(userResult.logo);  
  })

});


module.exports = router;