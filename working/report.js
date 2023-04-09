const downloadBtn = document.getElementById('download');
const prevBtn = document.getElementById('previousDownload');

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