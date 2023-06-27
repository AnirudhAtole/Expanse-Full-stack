const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ForgotpasswordSchema = new Schema({
    isActive : {
        type : Boolean,
    },

    UserUserId : {
        type : Schema.Types.ObjectId,
        required : true,
    }
})

module.exports = mongoose.model('forgotPasswordRequest',ForgotpasswordSchema);



// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const ForgotPasswordRequest = sequelize.define('forgotpasswordrequest',
// {
//     id : {
//         type : Sequelize.STRING,
//         primaryKey : true,
//         allowNull : false
//     },
//     isActive :{
//         type : Sequelize.BOOLEAN
//     }
// })

// module.exports = ForgotPasswordRequest;