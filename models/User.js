const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    userId:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull : false,
        primaryKey : true
    },
    userName : Sequelize.STRING,
    userPassword : Sequelize.STRING,
    userEmail:Sequelize.STRING,
});

module.exports = User;