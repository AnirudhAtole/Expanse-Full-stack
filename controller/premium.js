const User = require('../models/User');

exports.leaderBoard = async (req,res) =>{
    try{
        const userList = await User.findAll(
            {
                attributes : ['userName','totalExpanse'],
                order : [['totalExpanse' , 'DESC']]
            }
        )
       res.status(200).json({success: true , userList : userList})
    }
    catch(err){
        res.status(400).json({success:false})
        console.log(err);
    }
}

