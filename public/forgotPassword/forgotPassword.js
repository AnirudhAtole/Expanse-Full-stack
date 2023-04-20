const btn = document.getElementById('confirm');

btn.onclick = async function(e){
    try{
        e.preventDefault();
        const email = document.getElementById('email').value;
        console.log(email)
        const result = await axios.post('http://16.16.159.236:5000/password/forgotpassword', {email})
        if(result.data.success){
            alert("Email has  been sent");
        }
        else{
            alert(result.data.message)
        }
    }
    catch(err){
        console.log(err);
    }
   

}