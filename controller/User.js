const User = require('../models/User');

exports.addUser = (req,res) =>{
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    User.findByPk(userEmail)
    .then((result) =>{
        if(result){
            res.json({success:false , message:"UserEmail already exists"});
        }
        else{
            User.create({
                userName:userName,
                userEmail:userEmail,
                userPassword:userPassword
            })
            .then((result) =>{
                console.log('User added');
                res.json({success:true , message:"User created succesfully"});
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
}

exports.checkSignIn = (req,res) =>{
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    User.findByPk(userEmail)
    .then((result) =>{
        if(result == null){
            res.json({success:false , message:"response 404 (User not found)"});
        }
        else if(result){
            User.findAll({
                where:{
                    userEmail:userEmail,
                    userPassword:userPassword
                }
            })
            .then((result) =>{
                console.log(result)
                if(result.length){
                    res.json({success:true,message:"User signed in"});
                }
                else{
                    res.json({success:false , message:"response 401 (User not authorized)"});
                }
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
}