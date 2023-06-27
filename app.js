require('dotenv').config();
let express = require('express');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');


const accessLog = fs.createWriteStream(path.join(__dirname,'accessLog.log') , {flags:'a'});

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const ExpanseRoutes = require('./routes/Expanse');
const OrderRoutes = require('./routes/Orders');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');


app.use(morgan('combined',{stream:accessLog}));
// app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(UserRoutes);
app.use(ExpanseRoutes);
app.use(OrderRoutes);
app.use(premiumRoutes);
app.use(passwordRoutes);

app.use((req,res) =>{
    res.sendFile(path.join(__dirname , `public/${req.url}`));
})

mongoose
.connect(`mongodb+srv://Anirudh:${process.env.PASSWORD}@expanse.i3qgdnl.mongodb.net/shop?retryWrites=true&w=majority`)
.then(result =>{
    console.log("connected");
    app.listen(5000);
})