const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req,res, next) =>{
    try{
        const token = req.header("Authorization");
        console.log(token)
        const Id = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId = await User.findById(Id.userId);
        req.user =  userId;
        console.log(userId)
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({success:false});
    }
}