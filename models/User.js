const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName : {
        type : String,
        required : true,
    },

    userPassword : {
        type : String,
        required : true,
    },

    userEmail : {
        type : String,
        required : true,
    },

    isPremium :{
        type: Boolean,
    },
         
    totalExpanse :{
        type : Number,
        default: 0
    },
},);

module.exports = mongoose.model('User',UserSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const User = sequelize.define('User',{
//     userId:{
//         type: Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull : false,
//         primaryKey : true
//     },

//     userName :{
//         type: Sequelize.STRING,
//         allowNull:false,
//     },

//     userPassword:{
//         type : Sequelize.STRING,
//         allowNull : false,
//     },

//     userEmail :{
//         type : Sequelize.STRING,
//         allowNull : false,
//     },

//     isPremium :{
//         type: Sequelize.BOOLEAN,
//     },

//     totalExpanse :{
//         type : Sequelize.INTEGER,
//         defaultValue: 0
//     }
// });

// module.exports = User;