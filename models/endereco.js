const Sequelize = require("sequelize")
const connection = require("../database/connection")
const usuario = require("./usuario")

const endereco = connection.define("endereco", {
    id_endereco: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, cidade: {
        type: Sequelize.STRING,
        allowNull: false
    }, bairro: {
        type: Sequelize.STRING,
        allowNull: true
    },  rua: {
        type: Sequelize.STRING,
        allowNull: false
    }, numero: {
        type: Sequelize.STRING,
        allowNull: true
    }, cep: {
        type: Sequelize.STRING,
        allowNull: true
    }, estado: {
        type: Sequelize.STRING,
        allowNull: true
    }


})

endereco.belongsTo(usuario);
usuario.hasOne(endereco);


//endereco.sync({force: true})

module.exports = endereco