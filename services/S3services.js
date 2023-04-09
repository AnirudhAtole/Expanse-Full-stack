const Aws = require('aws-sdk');

exports.uploadToS3  = async(data,filename)=>{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;

    let s3Bucket = new Aws.S3({
        accessKeyId : IAM_USER_KEY,
        secretAccessKey : IAM_SECRET_KEY,
        // Bucket : BUCKET_NAME
    })
    var params = {
        Bucket : BUCKET_NAME,Key : filename,Body : data,
        ACL : 'public-read'
            }
    
    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,data)=>{
            if(err){
                console.log('Something went wrong',err);
                reject(err);
            }
            else{
                console.log('success',data);
                resolve(data.Location);
            }
        })
    })  
}