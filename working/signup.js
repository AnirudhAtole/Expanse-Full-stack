let myForm = document.getElementById('my-form');

async function saveUser(user){
    try{
        let result = await axios.post('http://localhost:5000/add-User',user);
        if(result.data.success){
            alert(result.data.message)
            window.location.href = '../views/login.html';
        }
        else{
            alert(result.data.message)
        }
    }
    catch(err){
        console.log(err);
    }
}


myForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;
    const User ={
        userName:userName,
        userEmail:userEmail,
        userPassword:userPassword
    }  
    saveUser(User);
})