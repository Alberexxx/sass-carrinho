const Sequelize = require("sequelize")
const connection = require("../database/connection")

const categoria = connection.define("categorias", {
    id_categoria: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, nome_categoria: {
        type: Sequelize.STRING,
        allowNull: false
    }, descricao: {
        type: Sequelize.STRING,
        allowNull: true
    }

})



//categoria.sync({force: true})

module.exports = categoria