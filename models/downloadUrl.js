const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadUrlSchema = new Schema({
    url:{
        type : String,
        requred: true
    },
    UserUserId:{
        type : Schema.Types.ObjectId,
        required : true,
    }
})

module.exports = mongoose.model('downloadUrl',downloadUrlSchema);



// const sequelize = require('../utils/database');
// const Sequelize = require('sequelize');

// const downloadUrl = sequelize.define('downloadurl',{
//     id:{
//         type : Sequelize.INTEGER,
//         allowNull : false,
//         autoIncrement : true,
//         primaryKey : true,
//     },

//     url:{
//         type:Sequelize.STRING,
//     }
// });

// module.exports = downloadUrl;