let sign = document.getElementById('signIn');

sign.addEventListener('click',(e) =>{
    e.preventDefault()
    user ={}
    user.userEmail = document.getElementById('signemail').value;
    user.userPassword = document.getElementById('signpassword').value;
    SignIn(user);
});

async function SignIn(user){
    try{
        let result = await axios.post('http://localhost:5000/signIn',user);
        if(result.data.success){
            alert(result.data.message);
            window.open('../views/expansePage.html')
        }
        else{
            alert(result.data.message);
        }
        }
    catch(err){
        console.log(err);
    }
}