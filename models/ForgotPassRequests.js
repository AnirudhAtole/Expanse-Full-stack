const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const ForgotPasswordRequest = sequelize.define('forgotpasswordrequest',
{
    id : {
        type : Sequelize.STRING,
        primaryKey : true,
        allowNull : false
    },
    isActive :{
        type : Sequelize.BOOLEAN
    }
})

module.exports = ForgotPasswordRequest;