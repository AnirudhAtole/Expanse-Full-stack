const Expanse = require('../models/Expanse');
const User = require('../models/User');

exports.leaderBoard = async (req,res) =>{
    const userList = []
   const result = await User.findAll();
   for(let user of result){
    const userId = user.dataValues.userId;
    const expanses = await Expanse.findAll({
        where:{
            UserUserId : userId
        }
    })
    let sum = 0;
    for(let expanse of expanses){
        sum += expanse.dataValues.amount;
    }
    userList.push({user:user.dataValues.userName , userSum : sum})
   }
   for(let i = 0 ; i < userList.length; i++){
    for(let j = 0 ; j < userList.length -1 ; j++){
        if(userList[j].userSum < userList[j+1].userSum){
            const temp = userList[j];
            userList[j] = userList[j+1];
            userList[j+1] = temp
        }
    }
   }       
   res.json(userList)
}