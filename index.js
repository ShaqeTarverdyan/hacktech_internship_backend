const express = require('express');
const bodyParser =require('body-parser');
const sequelize = require('./util/database');
const cors = require("cors");
const File = require('./models/file');
const Image = require('./models/image')
const app = express();
const multer = require('multer');
const dotenv = require('dotenv');
var path = require('path');
const Admin = require('./models/admin');
const News = require('./models/news');
const AdminsNews = require('./models/AdminsNews');

Admin.belongsToMany(News, { through: AdminsNews });
News.belongsToMany(Admin, { through: AdminsNews });
dotenv.config();
app.use(express.json());
app.use(cors());

app.use('/public',express.static('public'));

File.belongsTo(News);
News.hasMany(File, { 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});

Image.belongsTo(News);
News.hasMany(Image, { 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})



const adminRoutes = require('./routes/admin');
const newsRouter = require('./routes/news');

app.use(adminRoutes);
app.use(newsRouter);
app.use(bodyParser.json());
app.use(
    multer().array('file')
);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data})
});

sequelize
    .sync({force: false})
    .then(result => {
        app.listen(3001);
    }).catch(err => console.log(err))



    