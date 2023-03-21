const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    userEmail:{
        type: Sequelize.STRING,
        allowNull : false,
        primaryKey : true
    },
    userName : Sequelize.STRING,
    userPassword : Sequelize.STRING,
});

module.exports = User;