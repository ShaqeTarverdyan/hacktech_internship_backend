const express = require('express');
const bodyParser =require('body-parser');
const sequelize = require('./util/database');
const cors = require("cors");
const app = express();
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const adminRoutes = require('./routes/admin');
const newsRouter = require('./routes/news');

dotenv.config();
app.use(express.json());
app.use(cors());
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

app.use('/public',express.static('public'));

sequelize
    .sync({force: false})
    .then(result => {
        app.listen(3001);
    }).catch(err => console.log(err))



    