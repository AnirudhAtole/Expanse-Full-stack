const Expanse = require('../models/Expanse');

exports.getExpanses = (req,res,next) =>{
    Expanse.findAll({
        where:{
            UserUserID:req.userId
        }
    })
    .then((result)=>{
        res.json(result);
    })
    .catch(err => console.log(err));
}

exports.addExpanse = (req,res,next) =>{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    Expanse.create({
            amount:amount,
            description:description,
            category:category
        })
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
