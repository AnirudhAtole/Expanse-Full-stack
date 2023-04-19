let sign = document.getElementById('my-form');

sign.addEventListener('submit',(e) =>{
    e.preventDefault()
    user ={}
    user.userEmail = document.getElementById('signemail').value;
    user.userPassword = document.getElementById('signpassword').value;
    SignIn(user);
});

async function SignIn(user){
    try{
        let result = await axios.post('http://13.53.43.146:5000/signIn',user);
        if(result.data.success){
            localStorage.setItem('token',result.data.token)
            alert(result.data.message);
            window.location.href = '../expansePage/expansePage.html';
        }
        else{
            alert(result.data.message);
        }
        }
    catch(err){
        console.log(err);
    }
}