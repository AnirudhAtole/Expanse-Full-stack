const User = require('../models/User');

exports.leaderBoard = async (req,res) =>{
    try{
        const userList = await User.find().select('userName totalExpanse -_id').sort({totalExpanse : -1})
       res.status(200).json({success: true , userList : userList})
    }
    catch(err){
        res.status(400).json({success:false})
        console.log(err);
    }
}

