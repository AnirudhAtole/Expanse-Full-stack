const Expanse = require('../models/Expanse');
const User = require('../models/User');
const sequelize = require('../utils/database')

exports.getExpanses = (req,res,next) =>{
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
    let t;
    try{
        t = await sequelize.transaction();
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const result = await Expanse.create(
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

    await User.increment('totalExpanse' , {by : amount , where :{ userId : req.user.dataValues.userId}, transaction:t})

    console.log("entry created");
    await t.commit()
    res.json(result);
    }
    catch(t){
        console.log(err)
        await t.rollback();
    }
}

exports.delExpanse = async (req , res , next) =>{
    const expanseId = req.params.id;
    const expanse = await Expanse.findByPk(expanseId)
    const amount = expanse.dataValues.amount;
    const userId = expanse.dataValues.UserUserId;
    console.log(amount,userId);
    const promise1 =  User.increment('totalExpanse' , {by : -amount , where :{ userId : userId}})
    const promise2 = Expanse.destroy({
        where:{
            id:expanseId
        }
    })
    Promise.all([promise1,promise2])
    .then(res.json({success:true}))
    
    .catch(err => console.log(err))
}
