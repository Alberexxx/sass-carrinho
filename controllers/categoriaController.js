const express = require('express');
const router = express.Router();
const categoria = require("../models/categoria")


// --------> CRUD <-------- //

//READ
router.get('/get', (req, res) => {
    categoria.findAll().then((   ) => {
        
        
    }).catch((err) => {
        res.send(err)
    })
})


//CREATE
router.get('/add', (req, res) => {

   categoria.create({
    

   }).then(() => {
    
   }).catch((err) => {
    res.send(err)
   })
})


//UPDATE


//DELETE




module.exports = router;