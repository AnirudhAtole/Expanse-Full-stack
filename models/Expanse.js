const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Expanse = sequelize.define('Expanse-list',{
    id:{
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    amount: Sequelize.STRING,
    description : Sequelize.STRING,
    category : Sequelize.STRING
});

module.exports = Expanse;