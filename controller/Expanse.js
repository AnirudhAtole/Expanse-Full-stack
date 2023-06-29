const Expanse = require('../models/Expanse');
const User = require('../models/User');
const DownloadUrls = require('../models/downloadUrl');
const S3services = require('../services/S3services');

exports.getExpanses = async (req,res,next) =>{
    // req.user.getExpanse()
    const page = +req.query.page || 1;
    const EXPANSE_PER_PAGE = +req.query.entries;
    try{
        const totalItems = await Expanse.count({UserUserId : req.user._id.toString()});
        const result = await Expanse.find({UserUserId : req.user._id.toString()}).skip((page-1) * EXPANSE_PER_PAGE).limit(EXPANSE_PER_PAGE);
        console.log(result);
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
    try{
    const amount = parseInt(req.body.amount);
    const description = req.body.description;
    const category = req.body.category;
    const promise1 = Expanse.create(
        {
            amount:amount,
            description:description,
            category:category,
            UserUserId : req.user._id.toString()
        }
     )
    console.log(req.user)
    req.user.totalExpanse = req.user.totalExpanse + amount;

    const promise2 = req.user.save();

    const result = await Promise.all([promise1,promise2])
    console.log(result);
    res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}

exports.delExpanse = async (req , res , next) =>{
    try{
    
    const expanseId = req.params.id;
    const expanse = await Expanse.findById(expanseId)
    console.log(`this is expanse as ${expanse}`)
    const amount = parseInt(expanse.amount);
    const user  = await User.findById(expanse.UserUserId.toString());
    user.totalExpanse = user.totalExpanse - amount;
    const promise1 = user.save();
    const promise2 = Expanse.findByIdAndRemove(expanseId);
    await Promise.all([promise1,promise2])
    res.status(200).json({success:true});
    }
    catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
}


exports.downloadExpanse = async(req,res)=>{
    try{
        const expanses = await Expanse.find({
                UserUserId : req.user._id.toString()
        });
        const stringifiedData = JSON.stringify(expanses);
    
        const fileName = `expanse${req.user._id.toString()}&${new Date()}.txt`;
    
        const fileUrl = await S3services.uploadToS3(stringifiedData,fileName);
        console.log(fileUrl)
    
        await DownloadUrls.create({
            url : fileUrl,
            UserUserId : req.user._id.toString()
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
        const urls = await DownloadUrls.find({
                UserUserId : req.user.dataValues.userId
        })
        res.status(200).json({urlLists : urls , success : true});
    }
    catch(err){
        res.status(403).json({success:false , message : 'Unable to get download URL'})
    }
}

exports.getTodayExpanse = async(req,res) =>{
    try{
        const userId = req.user._id.toString()
        const result = await Expanse.find({UserUserId:userId}).select('createdAt amount category description -_id')
        // const result = await sequelize.query(`Select time(createdAt) as time ,category ,description as description , amount 
        // from expanse.expanselists
        // Where date(createdAt) = curdate() and UserUserId = ${userId};`,{ type: QueryTypes.SELECT });
        res.status(200).json({success:true , result:result});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false});
    }
    
}
