let express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
const app = express();

const UserRoutes = require('./routes/User');
const sequelize = require('./utils/database')

app.use(bodyParser.json({extended:false}));
app.use(UserRoutes);
app.use(cors());

sequelize.sync()
.then(() =>{
    app.listen(5000);
})