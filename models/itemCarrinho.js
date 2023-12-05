const Sequelize = require("sequelize")
const connection = require("../database/connection")
const Carrinho = require("./carrinho")
const Produto = require("./product")

const item_carrinho = connection.define("item_carrinho", {
    id_item: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, preco_unitario: {
        type: Sequelize.DECIMAL,
        allowNull: true
    }

})

Carrinho.hasMany(item_carrinho);
item_carrinho.belongsTo(Carrinho);
//
Produto.hasMany(item_carrinho);
item_carrinho.belongsTo(Produto);

//item_carrinho.sync({force: true})

module.exports = item_carrinho