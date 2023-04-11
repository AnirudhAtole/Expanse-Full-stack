const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Expanse = sequelize.define('expanselist',{
    id:{
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    amount: Sequelize.INTEGER,
    description : Sequelize.STRING,
    category : Sequelize.STRING
});

module.exports = Expanse;