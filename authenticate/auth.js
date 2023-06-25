const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req,res, next) =>{
    try{
        const token = req.header("Authorization");
        const Id = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(Id)
        console.log(Id.userId)
        const userId = await User.findByPk(Id.userId);
        req.user =  userId;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({success:false});
    }
}