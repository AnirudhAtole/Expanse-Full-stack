require('dotenv').config();
let express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const ExpanseRoutes = require('./routes/Expanse');
const OrderRoutes = require('./routes/Orders');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const downloadUrlRoutes =  require('./routes/downloadUrl');


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


app.use(bodyParser.json());
app.use(cors());
app.use(UserRoutes);
app.use(ExpanseRoutes);
app.use(OrderRoutes);
app.use(premiumRoutes);
app.use(passwordRoutes);
app.use(downloadUrlRoutes);



sequelize.sync()
.then(() =>{
    app.listen(5000);
})
.catch(err => console.log(err));