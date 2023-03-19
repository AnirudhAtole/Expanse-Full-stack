const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    id:{
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    userName : Sequelize.STRING,
    userEmail : Sequelize.STRING,
    userPassword : Sequelize.STRING,
});

module.exports = User;