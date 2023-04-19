
let my_form = document.getElementById('my-form');
let outputTable  = document.getElementById('entries');
let premium = document.getElementById('prem');
const leader = document.getElementById('leader');
const showReport = document.getElementById('report');
my_form.addEventListener('submit',save_expanse);
const pagination = document.getElementById('pagination');

showReport.onclick = ()=>{
    window.location.href ='../report/report.html'; 
}
premium.onclick  = async function (e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://13.53.43.146:5000/premiumMembership' , {headers : {'Authorization' : token}});
    var options = {
        "key" : response.data.key_id ,
        "order_id" : response.data.order.id,

        "handler" : async function (response){
            const result = await axios.post('http://13.53.43.146:5000/updateTransaction' , {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,   
            }, {headers : {'Authorization' : token}})

            console.log(result);
            alert("You are a Premium User Now");
            localStorage.setItem('token',result.data.token)
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
    showReport.removeAttribute('disabled');
    premium.parentElement.appendChild(showText);
}

function IsPremium(decoded){
    if(decoded.isPremium){
        showPremium()
    }
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


async function getAllExpanses(token,page){
    try{
        let entries = localStorage.getItem('numofentries');
        if(!entries){
            entries = 5;
        }
        entries = parseInt(entries);
        let response = await axios.get(`http://13.53.43.146:5000/expanses?page=${page}&entries=${entries}` , { headers :{"Authorization":token}});
        const{expanses , ...pageInfo} = response.data;
        expanses.forEach(entry => showExpanse(entry));
        showPagination(pageInfo);
    }
    catch(err)
    {
        console.log(err);
    }
}

async function delExpanse(id,li){
    try{
       const result = await axios.post(`http://13.53.43.146:5000/del-expanse/${id}`)
       if(result.data.success){
        outputTable.removeChild(li);
       }
       else{
        alert('Unable to delete the expanse right now');
       }
   
    }
    catch(err){
        console.log(err);
    }
}

async function saveExpanse(expanse){
    try{
        const token = localStorage.getItem('token');
        let result1 = await axios.post('http://13.53.43.146:5000/add-expanse',expanse , { headers :{"Authorization":token}});
        console.log(result1)
        if(result1.data.success){
            expanse.id = result1.data.result.id;
            showExpanse(expanse);
        }
        else{
            alert('Unable to add expanse')
        }
    }
    catch(err){
        console.log(err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded" , ()=>{
    const objUrlParams = new URLSearchParams(Window.location);
    const page = objUrlParams.get('page') || 1;

    const entries = localStorage.getItem('numofentries');

    if(entries){
        document.getElementById('formControlRange').value = entries;
        document.getElementById('showEntries').innerHTML = entries;
    }

    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    console.log(decoded)
    IsPremium(decoded);
    getAllExpanses(token,page);
    
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
}

leader.onclick = async function (e){
    e.preventDefault()
    const result = await axios.get(`http://13.53.43.146:5000/premium/leaderBoard`);
    if(result.data.success){
        console.log(result.data)
        showUserList(result.data.userList);
    }
    else{
        alert('Unable to get leaderBoard');
    }
    
}

function showUserList(userlist){
    let userTable = document.createElement('table');
    userTable.className = 'table table-borderless';

    userTable.innerHTML =`
    <thead class="thead-dark">
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Name</th>
        <th scope="col">Amount</th>
      </tr>
    </thead>
    <tbody id="userList">
    </tbody>`


  document.getElementById('show').appendChild(userTable)
  const tableBody = document.getElementById('userList');
  let index = 1 ;
  for(let user of userlist){
    const rowValues = document.createElement('tr');
    const rank = document.createElement('td');
    rank.appendChild(document.createTextNode(''+index));
    rowValues.appendChild(rank);
    for(let i in user){
        const value = document.createElement('td');
        value.appendChild(document.createTextNode(user[i]))
        rowValues.append(value);
    }
    index++;
    tableBody.appendChild(rowValues);
  }
}

function showPagination({
    currentPage, hasNextPage , nextPage , hasPreviousPage , previousPage , lastPage
})
{
    pagination.innerHTML =''

    if(hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click',()=>getPaginated(previousPage));
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click',()=>getPaginated(currentPage));
    pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click',()=>getPaginated(nextPage));
        pagination.appendChild(btn3);
    }

}

async function getPaginated(page){
    try{
        const token = localStorage.getItem('token');
        let entries = localStorage.getItem('numofentries');
        if(!entries){
            entries = 10;
        }
        entries = parseInt(entries);
        let response = await axios.get(`http://13.53.43.146:5000/expanses?page=${page}&entries=${entries}` , { headers :{"Authorization":token}});
        const{expanses , ...pageInfo} = response.data;
        outputTable.innerHTML = "";
        expanses.forEach(entry => showExpanse(entry));
        showPagination(pageInfo);
    }
    catch(err){
        console.log(err);
    }
}


document.getElementById('formControlRange').oninput =(e)=>{
    e.preventDefault()
    const numOfEntries = document.getElementById('formControlRange').value;
    document.getElementById('showEntries').innerHTML = numOfEntries;
    localStorage.setItem('numofentries',numOfEntries);
    const token = localStorage.getItem('token');
    outputTable.innerHTML = ''
    getAllExpanses(token,1);
    console.log(localStorage.getItem('numofentries'))
}