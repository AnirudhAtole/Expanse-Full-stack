const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order',{
    Id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull : false,
        primaryKey : true
    },
    paymentId : Sequelize.STRING,
    orderId : Sequelize.STRING,
    status : Sequelize.STRING,
});

module.exports = Order;