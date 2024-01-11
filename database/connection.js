const sequelize = require('sequelize');


const connection = new sequelize('inter', 'root', '@alabdudu7789', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

/* ---------- PRODUÇÃO ------------

const connection = new sequelize('carrinho', 'root', 'novasenha', {
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '-03:00',
    port: 3306,
});

*/

module.exports = connection;


