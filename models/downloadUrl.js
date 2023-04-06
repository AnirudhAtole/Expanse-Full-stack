const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const downloadUrl = sequelize.define('downloadurl',{
    id:{
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },

    url:{
        type:Sequelize.STRING,
    }
});

module.exports = downloadUrl;