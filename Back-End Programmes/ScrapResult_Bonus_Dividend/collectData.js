const puppeteer = require('puppeteer');
const { Client } = require('pg');
const http = require('http');

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
    // database: 'stockmarket',

});

client.connect();
const port = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
    (async function () {
        console.log('running')

        const browser = await puppeteer.launch({
            args: ['--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--start-maximized',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--enable-features=NetworkService',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list'],
            headless: false

        });
        console.log('running2')

        const page = await browser.newPage();
        await page.setViewport({
            width: 1342,
            height: 600,
            deviceScaleFactor: 1,
        });
        await page.goto("https://www.moneycontrol.com/stocks/marketinfo/bonus/index.php?sel_year=2021", { waitUntil: 'networkidle2', timeout: 0 });
        const Bonus = await page.evaluate(() => {
            const rows = document.querySelectorAll('body div#mc_mainWrapper.main div.PA10 div.FL div div.FL.PR20 div.MT15 table.b_12.dvdtbl tbody tr');
            const data = [];
            for (let i = 2; i < rows.length; i++) {

                const rowitem = rows[i];
                const compname = rowitem.querySelector('td:nth-child(1)>p>a>b').innerHTML;
                const ratio = rowitem.querySelector('td:nth-child(2)').innerHTML;
                const Announcement = rowitem.querySelector('td:nth-child(3)').innerHTML;
                const Record = rowitem.querySelector('td:nth-child(4)').innerHTML;
                const Ex_Bonus = rowitem.querySelector('td:nth-child(5)').innerHTML;
                const set = new Object();
                set['company'] = compname;
                set['Bonus Ratio'] = ratio;
                set['Announcement'] = Announcement;
                set['Record'] = Record;
                set['Ex_Bonus'] = Ex_Bonus;
                data.push(set);


            }
            return data;


        })

        const del = 'delete from bonus'
        client.query(del, (err, res) => {
            console.log(err);

        })


        const txt = 'INSERT INTO bonus(data) VALUES($1) RETURNING data'
        const value = [JSON.stringify(Bonus)];
        client.query(txt, value, (err, res) => {
            if (!err) {
                console.log(res.rows)

            } else {
                console.log(err.stack)


            }
        })


        const grab = 'Select data from bonus'
        client.query(grab, (err, res) => {
            if (!err) {
                console.log(res.rows[0]['data'])

            } else {
                console.log(err.message)
            }

        })



        const page2 = await browser.newPage();
        await page2.setViewport({
            width: 1342,
            height: 600,
            deviceScaleFactor: 1,
        });
        await page2.goto("https://www.moneycontrol.com/stocks/marketinfo/dividends_declared/index.php?sel_year=2021", { waitUntil: 'networkidle2', timeout: 0 });
        const Dividend = await page2.evaluate(()=>{

            const rows = document.querySelectorAll('body div#mc_mainWrapper.main div.PA10 div.FL div div.FL.PR20 div.MT15 table.b_12.dvdtbl tbody tr');
            const data = [];
            for (let i = 2; i < rows.length; i++) {

                const rowitem = rows[i];
                const compname = rowitem.querySelector('td:nth-child(1)>p>a>b').innerHTML;
                const divType = rowitem.querySelector('td:nth-child(2)').innerHTML;
                const divpercent = rowitem.querySelector('td:nth-child(3)').innerHTML;
                const Announcement = rowitem.querySelector('td:nth-child(4)').innerHTML;
                const record = rowitem.querySelector('td:nth-child(5)').innerHTML;
                const Ex_Dividend = rowitem.querySelector('td:nth-child(6)').innerHTML;
                const set = new Object();
                set['company'] = compname;
                set['divType'] = divType;
                set['divpercent'] = divpercent;
                set['Announcement'] = Announcement;
                set['Record'] = record;
                set['Ex_Dividend'] = Ex_Dividend;
                data.push(set);


            }
            return data;

        })

        const dele = 'delete from dividend'
        client.query(dele, (err, res) => {
            console.log(err);

        })


        const text = 'INSERT INTO dividend(data) VALUES($1) RETURNING data'
        const valu = [JSON.stringify(Dividend)];
        client.query(text, valu, (err, res) => {
            if (!err) {
                console.log(res.rows)

            } else {
                console.log(err.stack)


            }
        })


        const grb = 'Select data from dividend'
        client.query(grb, (err, res) => {
            if (!err) {
                console.log(res.rows[0]['data'])

            } else {
                console.log(err.message)
            }

        })

        






        const now = new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', timeStyle: 'medium', hourCycle: 'h24' });
        const time = now.toString();
        res.write('--' + time + '--');
        console.log('list writeen on browser');











    })()


})
server.listen(port, () => {
    console.log('server started');
});
