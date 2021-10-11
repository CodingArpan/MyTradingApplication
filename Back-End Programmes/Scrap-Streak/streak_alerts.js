const puppeteer = require('puppeteer');
const fs = require('fs');






(async function () {
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
    // ----------------------------------------------------------------------------------------------------------------------------------------
    //  Opening Streak ,Login and going target page and opening target blocks
    // ----------------------------------------------------------------------------------------------------------------------------------------

    const page = await browser.newPage();
    await page.setViewport({
        width: 1342,
        height: 600,
        deviceScaleFactor: 1,
    });

    // Entering in Zerodha Streak and login

    await page.goto("https://streakv3.zerodha.com/", { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector("#userid");
    await page.type("#userid", "DJ0237");
    await page.type("#password", "Mn$Kq2k@c");
    await page.click(".button-orange");
    await page.waitForSelector("#pin");
    await page.type("#pin", "403719");
    await page.click(".button-orange");

    // Opening live Scanner Alerts

    await page.waitForSelector("div#root> div:nth-child(1)> main> div:nth-child(1)> div:nth-child(2)> div");
    await page.goto("https://streakv3.zerodha.com/scans/live_scans");
    await page.waitForTimeout(2000);
    await page.click("div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div:nth-child(1)> div:nth-child(1)> div:nth-child(1)[role]");
    await page.waitForTimeout(2000);
    await page.click("div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div:nth-child(2)> div:nth-child(1)> div:nth-child(1)[role]");
    await page.waitForTimeout(2000);
    await page.click("div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div:nth-child(3)> div:nth-child(1)> div:nth-child(1)[role]");
    await page.waitForTimeout(2000);
    await page.click("div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div:nth-child(4)> div:nth-child(1)> div:nth-child(1)[role]");
    await page.waitForTimeout(2000);
    await page.click("div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div:nth-child(5)> div:nth-child(1)> div:nth-child(1)[role]");
    await page.waitForTimeout(2000);

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Collecting Alert Data from Streak
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------



    async function AlertAuto_update() {

        // Collecting Scanner alerts lists

        const grabAlertLists = await page.evaluate(() => {
            //  Collecting Values in Objet format
            const alerts = document.querySelectorAll('div#root> div:nth-child(1)> main[style]> div:nth-child(1)> div:nth-child(1)> div:nth-child(2)> div:nth-child(3)> div');
            const alertlists = new Object();
            alerts.forEach((element) => {
                const GetAlertNM = element.querySelector("div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1)");
                const AlertName = GetAlertNM.innerHTML;
                const listItems = [];
                alertlists[`${AlertName}`] = listItems;
                const StockAlertGroup = element.querySelectorAll('div:nth-child(1)> div:nth-child(2)[style]> div:nth-child(1)> div:nth-child(1)>   div:nth-child(2)> div:nth-child(2)> div:nth-child(1)> div[role]> div:nth-child(2)[style]> div[role]');
                StockAlertGroup.forEach((element) => {
                    const symbolNM = element.querySelector("div[role]:nth-child(1)> div[role]:nth-child(1)> div");
                    const symbol = symbolNM.innerHTML;
                    // listItems.push(symbol);



                    if (symbol.length < 50) {
                        const Nse = symbol.split('<').splice(0, 2).splice(0, 1).toString();
                        listItems.push(Nse.replace('&amp;', '&'));

                    } else if ((symbol.length > 50) && (symbol.length < 75)) {
                        const Nse = symbol.split('<').splice(0, 2).splice(1, 1).toString().split('>').splice(1, 1).toString();
                        listItems.push(Nse.replace('&amp;', '&'));
                    }
                    else if ((symbol.length > 75) && (symbol.length < 100)) {
                        const Nse = symbol.split('<')[0];
                        listItems.push(Nse.replace('&amp;', '&'));
                    } else if ((symbol.length > 100) && (symbol.length < 130)) {
                        const Nse = symbol.split('<').splice(0, 2).splice(1, 1).toString().split('>').splice(1, 1).toString();
                        listItems.push(Nse.replace('&amp;', '&'));

                    }
                })
            })

            return alertlists;

        })
        // console.log(grabAlertLists);

        // Exporting Intraday list---------------------------------------------------------------------

        fs.writeFile('E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/streak_alerts.txt', JSON.stringify(grabAlertLists), function (err) {
            if (err) throw err;
            console.log("created");
        });





        // deleting existing alerts in database---------------------------------------------------------------------



        // const del = 'delete from streak_alert'
        // client.query(del, (err, res) => {
        //     console.log(err);

        // })



        // // inserting new alerts in database ----------------------------------------------------------------------

        // const text = 'INSERT INTO streak_alert(alertlists) VALUES($1) RETURNING alertlists'
        // const values = [JSON.stringify(grabAlertLists)];
        // client.query(text, values, (err, res) => {
        //     if (!err) {
        //         console.log(res.rows)

        //     } else {
        //         console.log(err.stack)


        //     }
        // })

        // // extracting new alerts from database-----------------------------------------------------------------


        // const get = 'Select alertlists from streak_alert'
        // client.query(get, (err, res) => {
        //     if (!err) {
        //         console.log(res.rows[0]['alertlists'])
        //     } else {
        //         console.log(err.message)
        //     }
        //     //  client.end();
        // })

        const now = new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', timeStyle: 'medium', hourCycle: 'h24' });
        const time = now.toString();
        console.log(time);
        // res.write('--' + time + '--');
        // console.log('list writeen on browser');
        // // res.end();



    }
    AlertAuto_update();
    setInterval(AlertAuto_update, 1000);


})()










