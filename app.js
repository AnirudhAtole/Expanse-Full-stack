let express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const ExpanseRoutes = require('./routes/Expanse');
const sequelize = require('./utils/database');

const User = require('./models/User');
const expanse = require('./models/Expanse');

User.hasMany(expanse);

app.use(bodyParser.json({extended:false}));
app.use(UserRoutes);
app.use(ExpanseRoutes);
app.use(cors());



sequelize.sync()
.then(() =>{
    app.listen(5000);
})