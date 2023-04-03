const Expanse = require('../models/Expanse');
const User = require('../models/User');

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
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const totalexpanse = req.user.dataValues.totalExpanse;
        // req.user.createExpanse({
        //     amount:amount,
        //         description:description,
        //         category:category,
        //         // UserUserId : req.user.dataValues.userId
        // })
        const promise1 = Expanse.create(
            {
                amount:amount,
                description:description,
                category:category,
                UserUserId : req.user.dataValues.userId
            }
        )

        const promise2 = User.increment('totalExpanse' , {by : amount , where :{ userId : req.user.dataValues.userId}})

        Promise.all([promise1,promise2])
        .then((result) =>{
            console.log('created entryy');
            res.json(result);
        })
        .catch(err => console.log(err));
}

exports.delExpanse = (req , res , next) =>{
    const expanseId = req.params.id;
    Expanse.findByPk(expanseId)
    .then((Expanse) =>{
        res.json(Expanse.destroy());
    })
    .catch(err => console.log(err))
}
