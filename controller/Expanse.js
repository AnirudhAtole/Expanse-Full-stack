const Expanse = require('../models/Expanse');
const User = require('../models/User');
const sequelize = require('../utils/database');
const DownloadUrls = require('../models/downloadUrl');
const S3services = require('../services/S3services');

exports.getExpanses = async (req,res,next) =>{
    // req.user.getExpanse()
    Expanse.findAll({
        where:{
            UserUserId : req.user.dataValues.userId
        }
    })
    .then((result)=>{
        res.json(result);
    })
    .catch(err => console.log(err));
}

exports.addExpanse = async (req,res,next) =>{
    const t = await sequelize.transaction();
    try{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const promise1 = Expanse.create(
        {
            amount:amount,
            description:description,
            category:category,
            UserUserId : req.user.dataValues.userId
        },
        {
            transaction:t
        }
     )

    const promise2 = User.increment('totalExpanse' , {by : amount , where :{ userId : req.user.dataValues.userId}, transaction:t})

    const result = await Promise.all([promise1,promise2])
    console.log("entry created");
    await t.commit()
    res.json(result);
    }
    catch(err){
        console.log(err)
        await t.rollback();
    }
}

exports.delExpanse = async (req , res , next) =>{
    const t = await sequelize.transaction();
    try{
    const expanseId = req.params.id;
    const expanse = await Expanse.findByPk(expanseId)
    const amount = expanse.dataValues.amount;
    const userId = expanse.dataValues.UserUserId;
    console.log(amount,userId);
    const promise1 =  User.increment('totalExpanse' , {by : -amount , where :{ userId : userId} , transaction:t})
    const promise2 = Expanse.destroy({
        where:{
            id:expanseId
        },
        transaction:t
    })
    await Promise.all([promise1,promise2])
    await t.commit();
    res.json({success:true});
    }
    catch(err){
        await t.rollback();
        console.log(err);
    }
}


exports.downloadExpanse = async(req,res)=>{
    const expanses = await Expanse.findAll({
        where:{
            UserUserId : req.user.dataValues.userId
        }
    })
    const stringifiedData = JSON.stringify(expanses);

    const fileName = `expanse.txt${req.user.dataValues.userId}&${new Date()}`;

    const fileUrl = await S3services.uploadToS3(stringifiedData,fileName);

    await DownloadUrls.create({
        url : fileUrl,
        UserUserId : req.user.dataValues.userId
    })
    console.log(fileUrl)


    res.status(200).json({fileUrl:fileUrl , success:true});

}


exports.getDownloadUrls = async(req,res) =>{
    const urls = await DownloadUrls.findAll ({
        where:{
            UserUserId : req.user.dataValues.userId
        }
    })

    res.status(200).json({urlLists : urls , success : true});
}