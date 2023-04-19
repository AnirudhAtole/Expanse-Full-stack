require('dotenv').config();
let express = require('express');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLog = fs.createWriteStream(path.join(__dirname,'accessLog.log') , {flags:'a'});

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const ExpanseRoutes = require('./routes/Expanse');
const OrderRoutes = require('./routes/Orders');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');


const sequelize = require('./utils/database');

const User = require('./models/User');
const expanse = require('./models/Expanse');
const Order = require('./models/orders');
const frgtPassReq = require('./models/ForgotPassRequests');
const downloadUrl = require('./models/downloadUrl');


User.hasMany(expanse);
expanse.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(frgtPassReq);
frgtPassReq.belongsTo(User);

User.hasMany(downloadUrl);
downloadUrl.belongsTo(User);

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


sequelize.sync()
.then(() =>{
    app.listen(process.env.PORT || 5000);
})
.catch(err => console.log(err));