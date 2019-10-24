const express = require('express');
const APP_PORT = process.env.PORT;
const path = require('path');
const app = express();
const cors = require ('cors');
const fs = require('fs');
const uuid = require('uuid');
const request = require('request');
const qs = require('querystring');

const bodyParser= require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
dir = path.join(__dirname, 'public');
app.use(cors());

const transFilePath = path.join(dir, 'transactions.json');

// Pushes to array from file list
app.use((req,res,next)=> {
    next();
});

const readFile = (callback, returnJson = false, filePath = transFilePath, encoding = 'utf8') => {
    // console.log("Create Transaction Database...", transFilePath);
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            throw err;
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = transFilePath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            throw err;
        }

        callback();
    });
};

app.get('/api/transactions/get', (req,res,next)=>{
    fs.readFile(transFilePath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/api/transactions/get/:id', (req,res,next)=>{
    fs.readFile(transFilePath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        const transId = req.params["id"];
        jsonData = JSON.parse(data);
        // console.log(jsonData[transId]);
        res.status(200).send(jsonData[transId]);
    });
});

app.post('/api/transactions/create', (req,res,next)=>{
    // console.log("Create Transaction...", path.join(dir, 'transactions.json'))
    // console.log('data', req.body);
    
    readFile(data => {
        const newTransId = uuid.v4();
        // add the new transaction
        data[newTransId] = req.body;   
             
        
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send({success: true, message: 'New Transaction Added',
            transactionId: newTransId, transaction: data[newTransId] });
        });
    },
        true);
        
});

// UPDATE
app.put('/api/transactions/update/:id', (req, res) => {
    // console.log("Update Transaction...", path.join(dir, 'transactions.json'))
    // console.log('data', req.body);
    readFile(data => {
        const transId = req.params["id"];
        data[transId] = req.body;

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send({success: true, message: 'Transaction Edited',
            transactionId: transId, transaction: data[transId] });
        });
    },
        true);
});

// DELETE
app.delete('/api/transactions/delete/:id', (req, res) => {

    readFile(data => {

        const transId = req.params["id"];
        delete data[transId];

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send({success: true, message: 'Transaction Deleted',
            transactionId: transId, transaction: null});
        });
    }, 
        true);
});

// DO A GET TO EXTERNAL API
app.get('/api/price', (req,res,next)=>{
    const BTC_URI = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/all'
    + '?' + qs.stringify({crypto: 'BTC', fiat: 'SGD'});
    const options = {
        method: 'GET',
        url: BTC_URI,
        headers: {'X-testing': 'testing'}
    };
    request(options, (error, response, body)=>{
        if (!error && response.statusCode == 200) {
            // console.log(body);
            res.status(200).json(body);
        };
    });
});

app.use((req,res,next)=>{
   console.log('error - fell through');
   res.status(500).send({success: false, message: "Error - Path not found"});
});

app.listen(APP_PORT, ()=>{
    console.log(`App server started at ${APP_PORT}`);
})