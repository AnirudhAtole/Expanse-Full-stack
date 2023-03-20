const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    userName:{
        type: Sequelize.STRING,
        allowNull : false,
        primaryKey : true
    },
    userEmail : Sequelize.STRING,
    userPassword : Sequelize.STRING,
});

module.exports = User;