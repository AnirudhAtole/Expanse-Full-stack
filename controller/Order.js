const RazorPay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/User');

exports.purchasePremium = async (req,res) =>{
    try{
        var rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 50;

        rzp.orders.create({amount , currency : "INR"} , (err,order) =>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id , status : "PENDING"})
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
    try{
        const {payment_id , order_id} = req.body;
        Order.findOne({where : {order_id : order_id}})
        .then((order) =>{
            order.update({paymentid : payment_id , status : 'SUCCESSFUL'}
            .then(() =>{
                req.user.update({ispremiumuser : true})
                .then(() => {
                    return res.status(202).json({sucess : true , message : 'Transaction Sucessful'});
                })
                .catch((err) =>{
                    throw new Error(err);
                })
            }))
            .catch((err) =>{
                throw new Error(err);
            })
        })
        .catch((err) =>{
            throw new Error(err);
        })
    }
    catch(err){
        console.log(err);
    }
}