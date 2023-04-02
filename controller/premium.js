const Expanse = require('../models/Expanse');
const User = require('../models/User');
const sequelize = require('../utils/database')

exports.leaderBoard = async (req,res) =>{
    try{
        const userList = await User.findAll(
            {
                attributes : ['userName',[sequelize.fn('sum' , sequelize.col('expanse-lists.amount')) , 'totalAmount']],
                include : [{
                    model : Expanse,
                    attributes : []
                }],
                group : ['userId'],
                order : [['totalAmount' , 'DESC']]
    
            }
        )
       res.json(userList)
    }
    catch(err){
        console.log(err);
    }
}