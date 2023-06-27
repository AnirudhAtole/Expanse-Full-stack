const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentId:{
        type:String,
    },
    orderId:{
        type:String,
    },
    Status:{
        type:String,
    },
    UserUserId:{
        type:Schema.Types.ObjectId,
        required :true
    }
})

module.exports = mongoose.model('Order',orderSchema);
// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Order = sequelize.define('order',{
//     Id:{
//         type: Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull : false,
//         primaryKey : true
//     },
//     paymentId : Sequelize.STRING,
//     orderId : Sequelize.STRING,
//     status : Sequelize.STRING,
// });

// module.exports = Order;