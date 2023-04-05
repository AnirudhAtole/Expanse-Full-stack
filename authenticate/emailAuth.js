const User = require('../models/User');

exports.emailAuth = async ( req , res , next) =>{
    try{
        const email = req.body.email;
    const user = await User.findOne({
        where:{
            userEmail : email
        }
    })
    if(user){
        req.user = user;
        next();
    }
    else{
        res.json({success:false , message : "User with this email doesnt exist , plz enter correct email"});
    }
    }
    catch(err){
        console.log(err);
        res.status(201).json({success : false , message : "Something went wrong"});
    }
    
}