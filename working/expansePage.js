let my_form = document.getElementById('my-form');
let expanse_list = document.getElementById('expenses-list');
my_form.addEventListener('submit',save_expanse);


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


async function getAllExpanses(){
    try{
        let response = await axios.get('http://localhost:5000/expanses');
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
       let result = await axios.post('http://localhost:5000/add-expanse',expanse)
       expanse.id = result.data.id;
       showExpanse(expanse);
    }
    catch(err){
        console.log(err);
    }
}

window.addEventListener("DOMContentLoaded" , ()=>{
    getAllExpanses();
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