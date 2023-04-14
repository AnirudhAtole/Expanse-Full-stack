let Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.SQL_SCHEMA , process.env.SQL_USER_NAME , process.env.SQL_PASSWORD,{dialect:'mysql',host:'localhost'});

module.exports = sequelize;


