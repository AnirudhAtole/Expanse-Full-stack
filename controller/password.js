const sib = require('sib-api-v3-sdk');
const Uuid = require('uuid');
const ForgotPasswordRequest = require('../models/ForgotPassRequests');
const User = require('../models/User')
const Bcrypt = require('bcrypt');
const sequelize = require('../utils/database');

exports.forgotPassword = async(req,res) =>{

    try{
        //creating uuid and forgotpasswordreq
        const uuid = Uuid.v4();
        await req.body.user.createForgotPasswordRequest({
            id : uuid,
            isActive : true
        })
        
        //sending mail
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
            htmlContent : `<a href="http://localhost:5000/password/resetpassword/${uuid}">Reset password</a>`
        })
        res.json({sucess:true , messageId : result})
        }
        catch(err){
            console.log(err)
        }
    
}

exports.resetPassword = async (req,res) => {
    const id = req.params.uuid;
    const validReq = await ForgotPasswordRequest.findOne(
        {
            where:{
                id:uuid,
                isActive : true
            }
        }
    )
    if(validReq){
        res.status(200).send(`
                    <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            <script>
                const form = document.getElementById("my-form");
                form.addEventListener("submit",formSubmit);

                async function formSubmit(e){
                    e.preventDefault();
                    const pass1 = document.getElementById('pass1').value;
                    const pass2 = document.getElementById('pass2').value;

                    if(pass1 === pass2){
                    const result = await axios.post("http://localhost:5000/password/updatePassword/${id}" ,{password:pass1});
                    if(result.data.success){
                        alert(result.data.message);
                    }
                    }
                    else{
                        alert('password not matching with each other')
                    }
                }
            </script>
            </head>
            <body>
            <section class=" gradient-form text-center" style="background-color: rgb(29, 25, 25);">
                <div class="container py-5">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-xl-10">
                    <div class="card rounded-3 text-black">
                        <div >
                        <div >
                            <div class="card-body p-md-5 mx-md-4">
            
                            <div class="text-center">
                                <img src="https://img.freepik.com/premium-vector/password-reset-icon-flat-vector-design_116137-4571.jpg?w=2000"
                                style="width: 185px;" alt="logo">
                                <h4 class="mt-1 mb-5 pb-1">Reset Your password</h4>
                            </div>
            
                            <form id="my-form" class="text-center">

                                <div class="form-outline mb-4">
                                <input type="password" id="pass1" class="form-control"
                                    placeholder="Enter new password" />
                                <label class="form-label" for="email">Enter new Password</label>
                                </div>

                                <div class="form-outline mb-4">
                                    <input type="password" id="pass2" class="form-control"
                                    placeholder="Confirm Password" />
                                    <label class="form-label" for="email">Enter password again</label>
                                </div>


                                <div class="row">
                                <div class="col-sm-12 text-center pt-1 mb-5 pb-1">
                                    <button class="btn btn-info btn-block fa-lg gradient-custom-2 mb-3" type="submit">Confirm</button>
                                </div>
                                </div>
            
                            </form>
            
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            </body>
            </html>
        `)
        res.end()
    }
    else{
        res.status(201).send(`Request expired`)
    }
}

exports.updatePassword = async(req,res) =>{
    try{
        const newPassword = req.body.password;
        const resetId = req.params;
        const frgtPassReq = await ForgotPasswordRequest.findOne({
            where:{
                id:resetId
            }
        })
        const user = await User.findOne({
            where:{
                UserId : frgtPassReq.UserUserId
            }
        })

        if(user){
            Bcrypt.hash(newPassword,10, async(err,hash) =>{
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                user.update({
                    userPassword : hash
                }).then(()=>{
                    res.status(201).json({success:true , message:'password updated succesfully'});
                })
            })
        }
    }
    catch(err){
        console.log(err);
    }
}