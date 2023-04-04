const sib = require('sib-api-v3-sdk');


exports.forgotPassword = async(req,res) =>{

    try{
    const client = sib.ApiClient.instance;
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.SEND_IN_BLUE;

    const transEmailApi = new sib.TransactionalEmailsApi();

    const sender = {
        email : 'anirudhatole@gmail.com'
    }

    const receiver = [
        {
            email : req.body.email
        },
    ];

    const result = await transEmailApi.sendTransacEmail({
        sender,
        to :receiver,
        subject : 'Regarding password failure',
        textContent : `Hi dont worry we will get you back within some time`
    })
    res.json({sucess:true , messageId : result})
    }
    catch(err){
        console.log(err)
    }
    
}