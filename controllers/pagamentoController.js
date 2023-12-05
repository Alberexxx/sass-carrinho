const express = require('express');
const router = express.Router();
//const usuario = require("../models/pedido")


// --------> CRUD <-------- //

//READ
router.post('/pagamento', (req, res) => {

   res.render("pagamento", {valor: req.body.valor})
})


//UPDATE


//DELETE




module.exports = router;