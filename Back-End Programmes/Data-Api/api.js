//REST API  in Node.js

const express = require('express');
const app = express();
const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: "postgres",
    password: '123456',
    database: 'stockmarket'


    // host: 'database-1.cdvy73uhxs2p.ap-south-1.rds.amazonaws.com',
    // port: 5432,
    // user: "postgres",
    // password: 'tCb6zDw3GQ3sp7E',
    // database: 'stockmarket'

});

const port = process.env.PORT || 3300
app.listen(port, () => {
    console.log('Server is now listeing at port')
});
// app.use(express.static('public'));
app.use(express.text({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

client.connect();


app.get('/intraday', function (req, res) {

    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const data = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/IntraDay.txt").toString());;
        res.send(data);
    } catch (error) {
        res.json({ status: 'error' });

    }


})

app.get('/live_balance', function (req, res) {

    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const data = fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/live_balance.txt").toString();;
        res.send(data);
    } catch (error) {
        res.json({ status: 'error' });

    }


})

app.get('/streakalerts', function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const data = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/streak_alerts.txt").toString());
        res.send(data);
    } catch (error) {
        res.json({ status: 'error' });

    }


})

app.get('/bonus', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const get = 'Select data from bonus'
    client.query(get, (err, result) => {
        if (!err) {
            res.send(result.rows[0]['data'])
        } else {
            console.log(err.message)
        }
        //  client.end();
    })


})

app.get('/dividend', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const get = 'Select data from dividend'
    client.query(get, (err, result) => {
        if (!err) {
            res.send(result.rows[0]['data'])
        } else {
            console.log(err.message)
        }
        //  client.end();
    })


})

app.get('/requiredmarketdata', function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const data = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/requiredData.txt").toString());;
        res.send(data);
    } catch (error) {
        res.json({ status: 'error' });

    }
})

app.get('/sessions', function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const data = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/read.txt").toString());;
        res.send(data);
    } catch (error) {
        res.json({ status: 'error' });

    }
})

app.post('/requiredinstruments', function (req, res) {
    try {
        // console.log(req.body);
        const instruments = JSON.parse(req.body);
        fs.writeFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/instruments.txt", JSON.stringify(instruments));
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error' });

    }
})






