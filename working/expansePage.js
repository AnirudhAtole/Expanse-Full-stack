
let my_form = document.getElementById('my-form');
let outputTable  = document.getElementById('entries');
let premium = document.getElementById('prem');
const leader = document.getElementById('leader');
my_form.addEventListener('submit',save_expanse);
leader.addEventListener('onclick',showLeader)


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
            showPremium();
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

function showPremium(){
    const showText = document.createElement('h3');
    showText.appendChild(document.createTextNode('You  are a premium user now'));

    premium.setAttribute('hidden','hidden');
    leader.removeAttribute('hidden');
    premium.parentElement.appendChild(showText);
}

function IsPremium(token){
        axios.get('http://localhost:5000/isPremium' , { headers :{"Authorization":token}})
        .then((result)=>{
            if(result.data.success){
                showPremium()
            }
        })
        .catch(err => console.log(err));
}


function showExpanse(obj){
    let row = document.createElement('tr');
    const entry = {
        category : obj.category,
        description : obj.description,
        amount : obj.amount
    }

    for(let i in entry){
        let values = document.createElement('td');
        values.appendChild(document.createTextNode(entry[i]));
        row.appendChild(values)
    }


    // DELETE BUTTON//
    let delbtnRow = document.createElement('td');
    let del_button = document.createElement('input');
    del_button.type = 'button';
    del_button.value = 'delete';
    del_button.className = 'btn btn-danger';
    del_button.appendChild(document.createTextNode('delete'));
    delbtnRow.appendChild(del_button);

    row.appendChild(delbtnRow);

    outputTable.appendChild(row);
    let id = obj.id;

    del_button.onclick =()=> delExpanse(id,row);
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
       outputTable.removeChild(li);
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
    IsPremium(token);
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
    document.getElementById('expanse-amount').value = "";
    document.getElementById('desc').value = "";
    document.getElementById('category').value = "";
}

function showLeader(e){
    e.preventDefault()
}