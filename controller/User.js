const User = require('../models/User');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../utils/database')

exports.addUser = async (req,res) =>{
    const t = await sequelize.transaction();
    try{
        const userName = req.body.userName;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
    
        let result = await User.findOne({
            where:{
                userEmail : userEmail
            }
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
                    },
                    {
                        transaction:t
                    })
                    await t.commit();
                    res.status(200).json({success:true , message:"User created succesfully"});
                })
            }
            catch(err){
                await t.rollback();
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
        let check = await User.findAll({
            where:{
                userEmail:userEmail
            }
        }
            );
        if(!check.length){
            res.status(200).json({success:false , message:"response 404 (User not found)"});
        }
        else{
            try{
                let result = await User.findAll({
                    where:{
                        userEmail:userEmail,
                    }
                })
                const id =result[0].userId
                const isPremium = result[0].isPremium;
                if(result.length){
                    Bcrypt.compare(userPassword , result[0].userPassword ,(err ,result)=>{
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