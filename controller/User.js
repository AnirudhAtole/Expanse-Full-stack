const User = require('../models/User');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUser = async (req,res) =>{
    try{
        const userName = req.body.userName;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
    
        let result = await User.findOne({
                userEmail : userEmail
        });
        if(result){
            res.status(200).json({success:false , message:"UserEmail already exists"});
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
                res.status(403).json({success:false , message:"Unable to create user"});
                console.log(err);
            }
            }
        }
    catch(err){
        res.status(403).json({success : false , message : "Unable to create user"})
        console.log(err);
    }

}

function generateToken(id,isPremium){
    return jwt.sign({userId : id , isPremium:isPremium} , process.env.JWT_SECRET_KEY)
}

exports.checkSignIn = async (req,res) =>{
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    try{
        let check = await User.findOne({
                userEmail:userEmail
        });
        console.log(check)
        if(!check){
            res.status(200).json({success:false , message:"response 404 (User not found)"});
        }
        else{
            try{
                let result = await User.findOne({
                        userEmail:userEmail,
                     })
                const id = result._id.toString()
                const isPremium = result.isPremium;
                if(result){
                    Bcrypt.compare(userPassword , result.userPassword ,(err ,result)=>{
                        if(result){
                            console.log("IM IN")
                            res.status(200).json({success:true,message:"User signed in" , token:generateToken(id,isPremium)});
                        }
                        else{
                            res.status(200).json({success:false , message:"User not authorized"});
                        }
                    })
                   
                }
            }
            catch(err){
                res.status(403).json({success : false , message : "Unable to find user email"})
                console.log(err);
            }
        }
    }
    catch(err){
        res.status(403).json({success : false , message : "Unable to find user email"})
        console.log(err);
    }
}


exports.createToken = generateToken;