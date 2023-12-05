const Sequelize = require("sequelize")
const connection = require("../database/connection")

const UserAdmin = connection.define("usersAdmin", {
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, nome: {
        type: Sequelize.STRING,
        allowNull: false
    }, email: {
        type: Sequelize.STRING,
        allowNull: false
    }, senha: {
        type: Sequelize.STRING,
        allowNull: false
    }, foto: {
        type: Sequelize.STRING,
        allowNull: true
    }

})


//UserAdmin.sync({force: true})

module.exports = UserAdmin