const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (res,req , next) =>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const Id = jwt.verify(token,'bangaram1002Kannalu100204pandaGuddumuduu')
        const userId = await User.findByPk(Id);
        req.userId =  userId;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({success:false});
    }
}