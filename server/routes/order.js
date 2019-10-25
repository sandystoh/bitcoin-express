const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

module.exports = function(app, API_URL) {
    const BTC_API_URL = `${API_URL}/transactions`;

    dir = path.join(__dirname, '../', 'public');
    const transFilePath = path.join(dir, 'db/transactions.json');

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

    app.get(BTC_API_URL, (req,res,next)=>{
        fs.readFile(transFilePath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            res.send(JSON.parse(data));
        });
    });
    
    app.get(`${BTC_API_URL}/:id`, (req,res,next)=>{
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
    
    app.post(BTC_API_URL, (req,res,next)=>{
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
    app.put(`${BTC_API_URL}/:id`, (req, res) => {
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
    app.delete(`${BTC_API_URL}/:id`, (req, res) => {
    
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

}