const Sequelize = require("sequelize")
const connection = require("../database/connection")

const comentario_produto = connection.define("comentario_produto", {
    id_comentario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, comentario: {
        type: Sequelize.STRING,
        allowNull: false
    }, estrelas: {
        type: Sequelize.INTEGER,
        allowNull: true
    }

})



//Product.sync({force: true})

module.exports = comentario_produto