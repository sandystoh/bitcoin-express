const express = require('express');
const APP_PORT = process.env.PORT;
const path = require('path');
const app = express();
const cors = require ('cors');
const fs = require('fs');
var uuid = require('uuid');

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
    console.log("Create Transaction Database...", transFilePath);
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

app.get('/transactions/get', (req,res,next)=>{
    fs.readFile(transFilePath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/transactions/get/:id', (req,res,next)=>{
    fs.readFile(transFilePath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        const transId = req.params["id"];
        jsonData = JSON.parse(data);
        console.log(jsonData[transId]);
        res.send(jsonData[transId]);
    });
});

app.post('/transactions/create', (req,res,next)=>{
    console.log("Create Transaction...", path.join(dir, 'transactions.json'))
    console.log('data', req.body);
    
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
app.put('/transactions/update/:id', (req, res) => {
    console.log("Update Transaction...", path.join(dir, 'transactions.json'))
    console.log('data', req.body);
    readFile(data => {
        const transId = req.params["id"];
        data[transId] = req.body;

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`Transaction id:${transId} updated`);
        });
    },
        true);
});

// DELETE
app.delete('/transactions/:id', (req, res) => {

    readFile(data => {

        // add the new user
        const transId = req.params["id"];
        delete data[transId];

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${transId} removed`);
        });
    },
        true);
});

app.use((req,res,next)=>{
   console.log('error - fell through');
   res.status(500).redirect('error.html');
});

app.listen(APP_PORT, ()=>{
    console.log(`App server started at ${APP_PORT}`);
})