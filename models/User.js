const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    userId:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull : false,
        primaryKey : true
    },

    userName :{
        type: Sequelize.STRING,
        allowNull:false,
    },

    userPassword:{
        type : Sequelize.STRING,
        allowNull : false,
    },

    userEmail :{
        type : Sequelize.STRING,
        allowNull : false,
    },

    isPremium :{
        type: Sequelize.BOOLEAN,
    },

    totalExpanse :{
        type : Sequelize.INTEGER,
    }
});

module.exports = User;