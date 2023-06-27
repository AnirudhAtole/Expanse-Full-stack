const RazorPay = require('razorpay')
const Order = require('../models/orders');
const UserController = require('../controller/User');

exports.purchasePremium = (req,res) =>{
    try{
        var rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID ,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 5000;

        rzp.orders.create({amount:amount , currency : "INR"} , (err,order) =>{
            if(err){
                console.log(err)
            }
            Order.create({orderId: order.id , status : "PENDING" , UserUserId:req.user._id.toString()})
            .then(()=>{
                return res.status(201).json({order , key_id:rzp.key_id})
            })
            .catch(err => console.log(err));
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: "something went wrong" , error : err})
    }
}

exports.updateTransaction = async (req , res) =>{
    // const t = await sequelize.transaction();
    try{
        const {payment_id , order_id} = req.body;
        const userId = req.user._id.toString();  
        const order = await Order.findOne({orderId : order_id});
        order.paymentId = payment_id;
        order.status = "SUCCESSFUL";
        const promise1 = order.save();
        req.user.isPremium = true;
        const promise2 = req.user.save();
        await Promise.all([promise1,promise2])
        // await t.commit()
        return res.status(202).json({sucess : true , message : 'Transaction Sucessful' , token:UserController.createToken(userId,true)});
    }
    catch(err){
        // await t.rollback()
        res.status(403).json({success:false});
        console.log(err);
    }
}
