const Razorpay = require('razorpay');
let my_form = document.getElementById('my-form');
let expanse_list = document.getElementById('expenses-list');
let premium = document.getElementById('premium');
my_form.addEventListener('submit',save_expanse);

premium.onclick  = async function (e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/premiumMembership' , {headers : {'Authorization' : token}});
    console.log(response);
    var options = {
        "key" : response.data.key_id ,
        "order_id" : response.data.order.id,

        "handler" : async function (response){
            await axios.post('http://localhost:5000/updateTransaction' , {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,   
            }, {headers : {'Authorization' : token}})

            alert("You are a Premium User Now");
        },
    };
    
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed" , function(response){
        console.log(response);
        alert('Something went wrong');
    });
}


function showExpanse(obj){
    let li = document.createElement('li');

    // DELETE BUTTON//
    let del_button = document.createElement('input');
    del_button.type = 'button';
    del_button.value = 'delete';
    del_button.className = 'btn btn-danger';
    del_button.appendChild(document.createTextNode('delete'));

    let user_details = obj.amount + ' - ' + obj.description + ' - ' + obj.category;
    li.appendChild(document.createTextNode(user_details));
    li.appendChild(del_button);

    expanse_list.appendChild(li);
    let id = obj.id;

    del_button.onclick =()=> delExpanse(id,li);
}


async function getAllExpanses(token){
    try{
        let response = await axios.get('http://localhost:5000/expanses' , { headers :{"Authorization":token}});
        response.data.forEach(entry => showExpanse(entry));
    }
    catch(err)
    {
        console.log(err);
    }
}

async function delExpanse(id,li){
    try{
       await axios.post(`http://localhost:5000/del-expanse/${id}`)
       expanse_list.removeChild(li);
    }
    catch(err){
        console.log(err);
    }
}

async function saveExpanse(expanse){
    try{
        const token = localStorage.getItem('token');
        let result = await axios.post('http://localhost:5000/add-expanse',expanse , { headers :{"Authorization":token}});
       expanse.id = result.data.id;
       showExpanse(expanse);
    }
    catch(err){
        console.log(err);
    }
}

window.addEventListener("DOMContentLoaded" , ()=>{
    const token = localStorage.getItem('token');
    getAllExpanses(token);
})

function save_expanse(e){
    e.preventDefault();
    const expanse ={
    };
    expanse.amount = document.getElementById('expanse-amount').value;
    expanse.description = document.getElementById('desc').value;
    expanse.category = document.getElementById('category').value;
    saveExpanse(expanse);
}