const User = require('../models/User');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUser = async (req,res) =>{
    try{
        const userName = req.body.userName;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
    
        let result = await User.findByPk(userEmail);
        if(result){
            res.status(400).json({success:false , message:"UserEmail already exists"});
        }
        else{
            try{
                Bcrypt.hash(userPassword,10, async(err,hash)=>{
                    console.log(err);
                    await User.create({
                        userName:userName,
                        userEmail:userEmail,
                        userPassword:hash
                    })
                    res.status(200).json({success:true , message:"User created succesfully"});
                })
            }
            catch(err){
                console.log(err);
            }
            }
        }
    catch(err){
        console.log(err);
    }

}

function generateToken(id){
    return jwt.sign({userId : id} ,'bangaram1002Kannalu100204pandaGuddumuduu')
}

exports.checkSignIn = async (req,res) =>{
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    try{
        let check = await User.findAll({
            where:{
                userEmail:userEmail
            }
        }
            );
        if(check === null){
            res.status(404).json({success:false , message:"response 404 (User not found)"});
        }
        else{
            try{
                let result = await User.findAll({
                    where:{
                        userEmail:userEmail,
                    }
                })
                const id =result[0].userId
                if(result.length){
                    Bcrypt.compare(userPassword , result[0].userPassword ,(err ,result)=>{
                        if(result){
                            res.json({success:true,message:"User signed in" , token:generateToken(id)});
                        }
                        else{
                            res.json({success:false , message:"response 401 (User not authorized)"});
                        }
                    })
                   
                }
            }
            catch(err){
                console.log(err);
            }
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.isPremium = async (req,res) =>{
    res.json({success:req.user.isPremium});
}