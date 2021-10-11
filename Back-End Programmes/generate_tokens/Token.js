var KiteConnect = require("kiteconnect").KiteConnect;
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
        headless: true

    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1342,
        height: 600,
        deviceScaleFactor: 1,
    });
    await page.goto("https://kite.zerodha.com/connect/login?v=3&api_key=dj5idpkbo93l81yz", { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector("#userid");
    await page.waitForSelector("#password");
    await page.type("#userid", "DJ0237");
    await page.type("#password", "Mn$Kq2k@c");
    await page.click(".button-orange");
    await page.waitForSelector("#pin");
    await page.type("#pin", "403719");
    await page.click(".button-orange");
    await page.waitForTimeout(3000);
    await page.waitForSelector(".front_img");
    const url = page.url();
    // https://www.glacierpharma.in/?action=login&type=login&status=success&request_token=UFr9TdAxZN2jqVGLhyGoZox5HaKndDaM
    const urlarray = url.split("&");
    let request_token;
    urlarray.forEach((item)=>{
        if(item.includes('request_token')){
            request_token =item.replace('request_token=',''); 
        }
    })
    console.log(request_token);
    
    const kc = new KiteConnect({
        api_key: "dj5idpkbo93l81yz"
    });
    kc.generateSession(request_token, "sdk12l4c2odhpgu3rsksv0mbxd6c29yk")
        .then(function (response) {
            console.log(response);
            fs.writeFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/read.txt", JSON.stringify(response));

        })
        .catch(function (err) {
            console.log(err);
        });
        await browser.close();

})()