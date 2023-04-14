const Expanse = require('../models/Expanse');
const User = require('../models/User');
const sequelize = require('../utils/database');
const DownloadUrls = require('../models/downloadUrl');
const S3services = require('../services/S3services');
const { QueryTypes } = require('sequelize');

exports.getExpanses = async (req,res,next) =>{
    // req.user.getExpanse()
    const page = +req.query.page || 1;
    const EXPANSE_PER_PAGE = +req.query.entries;
    try{
        const totalItems = await Expanse.count({where:{UserUserId : req.user.dataValues.userId}});
        const result = await Expanse.findAll({where:{UserUserId : req.user.dataValues.userId} , offset : (page-1) * EXPANSE_PER_PAGE , limit:EXPANSE_PER_PAGE});
        res.status(200).json({
            expanses : result,
            currentPage : page,
            hasNextPage : EXPANSE_PER_PAGE * page < totalItems,
            nextPage : page + 1,
            hasPreviousPage : page > 1,
            previousPage : page - 1,
            lastPage : Math.ceil(totalItems/EXPANSE_PER_PAGE)
        });
    }
    catch(err){
        console.log(err)
        res.status(500).json()
    }
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
    await t.commit()
    res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err)
        res.status(400).json({success:false})
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
    const promise1 =  User.increment('totalExpanse' , {by : -amount , where :{ userId : userId} , transaction:t});
    const promise2 = Expanse.destroy({
        where:{
            id:expanseId
        },
        transaction:t
    });
    await Promise.all([promise1,promise2])
    await t.commit();
    res.status(200).json({success:true});
    }
    catch(err){
        await t.rollback();
        res.status(400).json({success:false});
        console.log(err);
    }
}


exports.downloadExpanse = async(req,res)=>{
    try{
        const expanses = await Expanse.findAll({
            where:{
                UserUserId : req.user.dataValues.userId
            }
        });
        const stringifiedData = JSON.stringify(expanses);
    
        const fileName = `expanse.txt${req.user.dataValues.userId}&${new Date()}`;
    
        const fileUrl = await S3services.uploadToS3(stringifiedData,fileName);
    
        await DownloadUrls.create({
            url : fileUrl,
            UserUserId : req.user.dataValues.userId
        });
    
        res.status(200).json({fileUrl:fileUrl , success:true});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success : false});
    }
    
}


exports.getDownloadUrls = async(req,res) =>{
    try{
        const urls = await DownloadUrls.findAll ({
            where:{
                UserUserId : req.user.dataValues.userId
            }
        })
        res.status(200).json({urlLists : urls , success : true});
    }
    catch(err){
        res.status(403).json({success:false , message : 'Unable to get download URL'})
    }
}

exports.getTodayExpanse = async(req,res) =>{
    try{
        const userId = req.user.userId
        const result = await sequelize.query(`Select time(createdAt) as time ,category ,description as description , amount 
        from expanse.expanselists
        Where date(createdAt) = curdate() and UserUserId = ${userId};`,{ type: QueryTypes.SELECT });
        res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false});
    }
    
}

exports.getDailyExpanse = async(req,res) =>{
    try{
        const userId = req.user.userId;
        const result = await sequelize.query(`Select date(createdAt) as date , sum(amount) as amount from expanse.expanselists
        Where month(createdAt) = month(curdate())and year(createdAt)= year(curdate()) and UserUserId = ${userId}
        group by date(createdAt)`,{ type: QueryTypes.SELECT });
        res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success : false});
    }
    
}

exports.getMonthlyExpanse = async(req,res) =>{
    try{
        const userId = req.user.userId
        const result = await sequelize.query(`Select  month(createdAt) as month , sum(amount) as amount , year(createdAt) as year
        from expanse.expanselists
        Where UserUserId = ${userId}
        group by month(createdAt) , UserUserId , year(createdAt);`,{ type: QueryTypes.SELECT })
        res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false});
    }
    
}