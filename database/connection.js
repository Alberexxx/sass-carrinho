const sequelize = require('sequelize');

const connection = new sequelize('inter', 'root', '@alabdudu7789', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;


