const express = require('express');
const bodyParser= require('body-parser');
const APP_PORT = process.env.PORT;
const cors = require ('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
// app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = '/api';

app.use(express.static(path.join(__dirname, 'public')));

require('./routes/order')(app, API_URL);
require('./routes/price')(app, API_URL);

app.use((req,res,next)=>{
   console.log('error - fell through');
   res.status(500).send({success: false, message: "Error - Path not found"});
});

app.listen(APP_PORT, ()=>{
    console.log(`App server started at ${APP_PORT}`);
})