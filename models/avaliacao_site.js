const Sequelize = require("sequelize")
const connection = require("../database/connection")

const avaliacao_site = connection.define("avaliacao_site", {
    id_avaliacao: {
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



//avaliacao_site.sync({force: true})

module.exports = avaliacao_site