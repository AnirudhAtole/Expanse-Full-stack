const User = require('../models/User');

exports.addUser = (req,res) =>{
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    User.findByPk(userName)
    .then((result) =>{
        if(result){
            res.json(result);
            return true;
        }
        User.create({
            userName:userName,
            userEmail:userEmail,
            userPassword:userPassword
        })
        .then((result) =>{
            console.log('User added');
            res.json(result);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}