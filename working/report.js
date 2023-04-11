const downloadBtn = document.getElementById('download');
const prevBtn = document.getElementById('previousDownload');
const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function setTodayDate(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = `${day}-${monthName[month]}-${year}`;

    const title = document.getElementById('date-heading');
    title.innerHTML = `Today's Expanse of ${currentDate}`;
}


downloadBtn.onclick = async function(e){
    try{
        e.preventDefault();
    const token = localStorage.getItem('token')
    const response =  await axios.get('http://localhost:5000/download/getexpanses' , { headers :{"Authorization":token}});

    const a = document.createElement("a");
    a.href = response.data.fileUrl;
    a.download = 'myexpense.csv';
    a.click()
    }
    catch(err){
        console.log(err);
    }
}

prevBtn.onclick = async function(e){
    try{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response =  await axios.get('http://localhost:5000/download/alldownloads' , { headers :{"Authorization":token}}); 

        showDownloadList(response.data.urlLists)

    }
    catch(err){
        console.log(err);
    }
}

function showDownloadList(downloadList){
    const show = document.getElementById('show');

    const h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode('Previous Downloads'))
    show.appendChild(h1);

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    for(let obj of downloadList){
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-dark';

        const a = document.createElement('a');
        a.href = obj.url;
        a.appendChild(document.createTextNode(`DownloadUrl-${obj.id}`));

        li.appendChild(a);
        ul.appendChild(li);
    }
    show.appendChild(ul);
}

async function showDailyExpanses(){
    const token = localStorage.getItem('token')
    const expanses = await axios.get('http://localhost:5000/expanse/todaysExpanse', { headers :{"Authorization":token}});
    const todayExpanse = document.getElementById('today-entries');

    let sumOfDaily = 0;
    expanses.data.forEach(element => {
        sumOfDaily += element.amount;
        createDailyEntry( todayExpanse,element);
    });

    const tr = document.createElement('tr');
    tr.className = "bg-info"
    tr.innerHTML = `<tr class="bg-info"> <th scope="row"></th> <td colspan="2"> Total </td> <td class="bg-primary">${sumOfDaily} Rs</td></tr>`;
    todayExpanse.appendChild(tr);
}

async function showCurrentMonthExpanse(){
    const token = localStorage.getItem('token')
    const expanses = await axios.get('http://localhost:5000/expanse/currentMonthExpanse', { headers :{"Authorization":token}});
    const currentMonthExpanse = document.getElementById('currentMonth-entries');
    let sumOfMonth = 0;
    expanses.data.forEach(element => {
        sumOfMonth += parseInt(element.amount);
        createCurrentMonthExpanse( currentMonthExpanse,element);
    });

    const tr = document.createElement('tr');
    tr.className = "bg-info";

    tr.innerHTML = `<tr class="bg-info"><th scope="row"></th><td colspan="1">total</td><td class="bg-primary">${sumOfMonth} Rs</td></tr>`

    currentMonthExpanse.appendChild(tr);

}

async function showYearlyExpanse(){
    const token = localStorage.getItem('token')
    const expanses = await axios.get('http://localhost:5000/expanse/monthlyExpanse', { headers :{"Authorization":token}});
    const yearlyExpanse = document.getElementById('yearly-entries');
    expanses.data.forEach(element => {
        createYearlyExpanse( yearlyExpanse,element);
    });
}

function createDailyEntry(dailyTable , obj){
    let entry = document.createElement('tr');

    let row = document.createElement('th');
    row.scope = "row";
    row.appendChild(document.createTextNode(obj.time));

    let cat = document.createElement('td');
    cat.appendChild(document.createTextNode(obj.category));

    let description = document.createElement('td');
    description.appendChild(document.createTextNode(obj.description));

    let amount = document.createElement('td');
    amount.appendChild(document.createTextNode(obj.amount));

    entry.appendChild(row);
    entry.appendChild(cat);
    entry.appendChild(description);
    entry.appendChild(amount);

    dailyTable.appendChild(entry);
}


function createCurrentMonthExpanse(monthTable,obj){
    let entry = document.createElement('tr');

    let row = document.createElement('th');
    row.scope = "row";
    row.appendChild(document.createTextNode(obj.date));

    const theDate = new Date(obj.date);
    const weekday = theDate.getDay();
    let day = document.createElement('td');
    day.appendChild(document.createTextNode(weekDays[weekday]));


    let amount = document.createElement('td');
    amount.appendChild(document.createTextNode(obj.amount));

    entry.appendChild(row);
    entry.appendChild(day);
    entry.appendChild(amount);

    monthTable.appendChild(entry);
}

function createYearlyExpanse(yearlyTable , obj){
    let entry = document.createElement('tr');

    const monthNum = obj.month - 1;
    let row = document.createElement('th');
    row.scope = "row";
    row.appendChild(document.createTextNode(monthName[monthNum]));

    let amount = document.createElement('td');
    amount.appendChild(document.createTextNode(obj.amount));

    let year = document.createElement('td');
    year.appendChild(document.createTextNode(obj.year));

    entry.appendChild(row);
    entry.appendChild(amount);
    entry.appendChild(year);

    yearlyTable.appendChild(entry);
}

window.addEventListener("DOMContentLoaded",()=>{
    showDailyExpanses();
    showCurrentMonthExpanse()
    setTodayDate();
    showYearlyExpanse();
})