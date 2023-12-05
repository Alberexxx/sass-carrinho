const Sequelize = require("sequelize")
const connection = require("../database/connection")

const carrinho = connection.define("carrinho", {
    id_carrinho: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, produtos: {
        type: Sequelize.STRING,
        allowNull: true
    }, valorTotal: {
        type: Sequelize.DECIMAL,
        allowNull: true
    }

})

//carrinho.sync({force: true})

module.exports = carrinho