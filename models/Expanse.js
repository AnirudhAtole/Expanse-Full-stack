const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expanseSchema = new Schema({
    amount :{
        type: Number,
        required : true
    },
    description :{
        type: String,
        required : true
    },
    category :{
        type: String,
        required : true
    },
    UserUserId :{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }, 
}, {timestamps:true});

module.exports = mongoose.model('Expanse',expanseSchema);



// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Expanse = sequelize.define('expanselist',{
//     id:{
//         type: Sequelize.INTEGER,
//         allowNull : false,
//         autoIncrement : true,
//         primaryKey : true
//     },
//     amount: Sequelize.INTEGER,
//     description : Sequelize.STRING,
//     category : Sequelize.STRING
// });

// module.exports = Expanse;