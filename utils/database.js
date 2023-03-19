let Sequelize = require('sequelize');

let sequelize = new Sequelize('expanse','root','Asparagus',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;


