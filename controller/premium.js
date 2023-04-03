const Expanse = require('../models/Expanse');
const User = require('../models/User');
const sequelize = require('../utils/database')

exports.leaderBoard = async (req,res) =>{
    try{
        const userList = await User.findAll(
            {
                attributes : ['userName','totalExpanse'],
                order : [['totalExpanse' , 'DESC']]
            }
        )
       res.json(userList)
    }
    catch(err){
        console.log(err);
    }
}