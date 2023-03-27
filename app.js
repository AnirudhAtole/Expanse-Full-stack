let express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const ExpanseRoutes = require('./routes/Expanse');
const sequelize = require('./utils/database');

const User = require('./models/User');
const expanse = require('./models/Expanse');
const Order = require('./models/orders');

User.hasMany(expanse);
expanse.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use(bodyParser.json({extended:false}));
app.use(UserRoutes);
app.use(ExpanseRoutes);
app.use(cors());



sequelize.sync({force:true})
.then(() =>{
    app.listen(5000);
})
.catch(err => console.log(err));