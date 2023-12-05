const Sequelize = require("sequelize")
const connection = require("../database/connection")
const Carrinho = require("./carrinho")
const Produto = require("./product")
const Pedido = require("./pedido")

const item_Pedido = connection.define("item_Pedido", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, quantidade: {
        type: Sequelize.INTEGER
    }

})

Pedido.hasMany(item_Pedido);
item_Pedido.belongsTo(Pedido);
//
Produto.hasMany(item_Pedido);
item_Pedido.belongsTo(Produto);

//item_Pedido.sync({force: true})

module.exports = item_Pedido