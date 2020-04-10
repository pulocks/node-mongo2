const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const uri = `mongodb+srv://${user}:${pass}@cluster0-xd5hw.mongodb.net/test?retryWrites=true&w=majority`;


let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// GET
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        //client.close();
      });  
})

app.get('/product/:key', (req, res) => {

    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find({key}).toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        //client.close();
      });  
})

app.post('/getProductsByKey', (req, res) => {

    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find({key: { $in: productKeys }}).toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        //client.close();
      });  
})


// POST
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.insert(product, (err, result) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        //client.close();
      });  
});

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        // perform actions on the collection object
        collection.insertOne(orderDetails, (err, result) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        //client.close();
      });  
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Listening to port 3001'));