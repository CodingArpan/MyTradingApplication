const puppeteer = require('puppeteer');
const fs = require('fs');


(async function () {
        // console.time("Time Took");

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
            headless: true

        });



        // ------------------------------------------------------------------------------------------------------------
        //  Openinging  Zerodha Intraday List
        //-----------------------------------------------------------------------------------------------------------


        const page1 = await browser.newPage();
        await page1.setViewport({
            width: 1342,
            height: 600,
            deviceScaleFactor: 1,
        });
        await page1.goto("https://docs.google.com/spreadsheets/d/e/2PACX-1vTk92oHyyBVJL73O7rORQ3o9dpknxHyKLFWKT_iqqn72ATKxTNtfo_5NhYQnYb8sMROo3zpr3SsR9O5/pubhtml?gid=0&single=true");
        await page1.waitForSelector(".waffle > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)");


        //-------------------------------------------------------------------------------------------------------
        // Collecting Intraday avilable Stocks And their Margins
        //-------------------------------------------------------------------------------------------------------


        const grabIntraDayLists = await page1.evaluate(() => {

            const IntraDayRow = document.querySelectorAll('.waffle > tbody:nth-child(2) > tr');
            const IntraSymb_Mpr = [];
            IntraDayRow.forEach((element) => {
                const symbl = element.querySelector('td:nth-child(2)').innerHTML;
                let ymbol;
                if(symbl.includes('&amp;')){
                   ymbol =symbl.replace('&amp;', '&') ;
                }else{
                    ymbol = symbl;
                }
                const Muplr = element.querySelector('td:nth-child(3)').innerHTML;
                if (ymbol != "" && Muplr != "" && Muplr != "#N/A") {
                    const stock = [ymbol, Muplr];
                    IntraSymb_Mpr.push(stock);

                }
            })

            return IntraSymb_Mpr;
        })


        // console.log(grabIntraDayLists);

        // deleting existing list in database---------------------------------------------------------------------


        // const del = 'delete from intraday_available'
        // client.query(del, (err, res) => {
        //     // console.log(err);

        // })

        // inserting new list in database ----------------------------------------------------------------------

        // const text = 'INSERT INTO intraday_available(intradaylist) VALUES($1) RETURNING intradaylist'
        // const values = [JSON.stringify(grabIntraDayLists)];
        // client.query(text, values, (err, res) => {
        //     if (!err) {
        //         // console.log(res.rows)

        //     } else {
        //         // console.log(err.stack)


        //     }
        // })

        // extracting new list from database-----------------------------------------------------------------


        // const get = 'Select intradaylist from intraday_available'
        // client.query(get, (err, res) => {
        //     if (!err) {
        //         // console.log(res.rows[0]['intradaylist'])
        //     } else {
        //         // console.log(err.message)
        //     }
        //     // client.end();
        // })


        const intraday = new Object();
        grabIntraDayLists.forEach((item)=>{
            intraday[item[0]] = Number(item[1]);

        })
        console.log(intraday);
        




        fs.writeFile('E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/IntraDay.txt', JSON.stringify(intraday), function (err) {
            if (err) throw err;
            console.log("created");
        });



        // console.timeEnd("Time Took");


        browser.close();
        // console.log(grabIntraDayLists);


        // res.write(JSON.stringify(intraday));
        console.log('list writeen on browser');


    })()


    






