const downloadUrl = require('../models/downloadUrl');

exports.getDownloadUrls = async(req,res) =>{
    try{
        const result = await downloadUrl.findAll({
            where:{
                UserUserId : req.user.dataValues.UserId
            }
        })
        res.json(result);
    }
    catch(err){
        console.log(err);
    }
   
}