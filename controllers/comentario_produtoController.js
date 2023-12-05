const express = require('express');
const router = express.Router();
const comentario = require("../models/comentario_produto")


// --------> CRUD <-------- //

//READ
router.get('/get', (req, res) => {
    comentario.findAll().then((   ) => {
        
        
    }).catch((err) => {
        res.send(err)
    })
})


//CREATE
router.get('/add', (req, res) => {

   comentario.create({
    

   }).then(() => {
    
   }).catch((err) => {
    res.send(err)
   })
})


//UPDATE


//DELETE




module.exports = router;