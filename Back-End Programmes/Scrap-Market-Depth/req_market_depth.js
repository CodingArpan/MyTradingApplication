const puppeteer = require('puppeteer');
const { Client } = require('pg');
const http = require('http');
const express = require('express');
const app = express();

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: "postgres",
    password: '123456',
    database: 'StockMarket'


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

client.connect();


