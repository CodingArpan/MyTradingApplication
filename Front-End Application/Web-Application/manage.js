const intraday = 'http://localhost:3300/intraday';
const streak = 'http://localhost:3300/streakalerts';
const requireinstruments = 'http://localhost:3300/requiredinstruments';
const live_balance = 'http://localhost:3300/live_balance';
const requiredstockdata = 'http://localhost:3300/requiredmarketdata';
const session = 'http://localhost:3300/sessions';
let audio = new Audio('NBUK26X-alarm.mp3');
let clickSound = new Audio('clickProcessed.wav');


(async function () {

    const response = await fetch(session);
    const getSession = await response.json();
    // console.log(getSession);
    var ticker = new KiteTicker({ api_key: "dj5idpkbo93l81yz", access_token: getSession.access_token });

    // --------------------------strat fetching index data from kite----------------------------

    ticker.connect();
    ticker.on("ticks", onTicks);
    ticker.on("connect", subscribe);

    function onTicks(ticks) {
        // console.log("Ticks", ticks);
        const board = document.querySelector('.container > .board');
        ticks.forEach((item) => {
            if (item.instrument_token == 256265) {
                board.querySelector('.nifty50 > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.nifty50 > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);

            } else if (item.instrument_token == 265) {
                board.querySelector('.sensex > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.sensex > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);

            } else if (item.instrument_token == 268041) {
                board.querySelector('.nifty500 > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.nifty500 > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);
            } else if (item.instrument_token == 260873) {
                board.querySelector('.niftymidcap50 > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.niftymidcap50 > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);
            } else if (item.instrument_token == 266761) {
                board.querySelector('.niftysmallcap50 > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.niftysmallcap50 > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);
            } else if (item.instrument_token == 264969) {
                board.querySelector('.indiavix > .change span').innerHTML = (item.change.toFixed(2));
                board.querySelector('.indiavix > .pre text').innerHTML = ((100 * (item.ohlc.open - item.ohlc.close)) / item.ohlc.close).toFixed(2);
            }
        })
        const story = document.querySelectorAll('.container > .board .story');
        story.forEach((item) => {
            const chng = Number(item.querySelector('.change span').innerHTML);
            const pre_open = Number(item.querySelector('.pre text').innerHTML);
            // console.log(pre_open);
            if (chng > 0) {
                item.querySelector('.change').style.backgroundColor = '#4bbf7431';
                item.querySelector('.change').style.color = '#38cc6b';
            } else if (chng < 0) {
                item.querySelector('.change').style.backgroundColor = '#d9544f23';
                item.querySelector('.change').style.color = '#d9534f';
            } else if (chng == 0) {
                item.querySelector('.change').style.backgroundColor = 'black';
                item.querySelector('.change').style.color = 'rgb(179, 179, 179)';
            }

            if (pre_open > 0) {
                item.querySelector('.pre').style.backgroundColor = '#4bbf7431';
                item.querySelector('.pre').style.color = '#38cc6b';
            } else if (pre_open < 0) {
                item.querySelector('.pre').style.backgroundColor = '#d9544f23';
                item.querySelector('.pre').style.color = '#d9534f';
            } else if (pre_open == 0) {
                item.querySelector('.pre').style.backgroundColor = '#000';
                item.querySelector('.pre').style.color = 'rgb(179, 179, 179)';
            }

        })


    }

    // instrument_token = INDEX
    // 264969=INDIA VIX
    // 260617=NIFTY 100
    // 264457=NIFTY 200
    // 256265=NIFTY 50
    // 268041=NIFTY 500
    // 263433=NIFTY AUTO***
    // 260105=NIFTY BANK***
    // 257545=NIFTY CONSUMPTION
    // 261641=NIFTY ENERGY***
    // 257801=NIFTY FIN SERVICE***
    // 261897=NIFTY FMCG***
    // 261385=NIFTY INFRA
    // 259849=NIFTY IT***
    // 263945=NIFTY MEDIA***
    // 263689=NIFTY METAL***
    // 260873=NIFTY MIDCAP 50
    // 262409=NIFTY PHARMA***
    // 262665=NIFTY PSE
    // 262921=NIFTY PSU BANK***
    // 271113=NIFTY PVT BANK***
    // 261129=NIFTY REALTY***
    // 263177=NIFTY SERV SECTOR
    // 266761=NIFTY SMLCAP 50
    // 265=SENSEX

    function subscribe() {
        var items = [264969,
            260617,
            264457,
            256265,
            268041,
            263433,
            260105,
            257545,
            261641,
            257801,
            261897,
            261385,
            259849,
            263945,
            263689,
            260873,
            262409,
            262665,
            262921,
            271113,
            261129,
            263177,
            266761,
            265
        ];
        ticker.subscribe(items);
        ticker.setMode(ticker.modeFull, items);
    }
})()


// --------------------------End fetching index data from kite----------------------------

// --------------------------start fetching intradaylist data from myApi----------------------------

async function getIntradayData() {
    const response = await fetch(intraday);
    const data = await response.json();
    // console.log(data);

    let symbol = "";
    const NewIntraList = []
    for (const key in data) {
        symbol += 'NSE:' + key.replace('&', '_').replace('-', '_') + ",";
        NewIntraList.push(key);
    }
    // console.log(symbol);
    document.querySelector('.container .togglewindow .market-overview .copy span').innerHTML = symbol;

    const typealert = document.querySelector('.container .togglewindow .set-alarm .setalertform input#SYMBOL');
    typealert.addEventListener('input', function () {
        // console.log(typealert.value);
        const inputval = typealert.value.toUpperCase();
        typealert.value = inputval;
        let val = inputval;

        // console.log(val);
        const setalertbutton = document.querySelector('.container .togglewindow .set-alarm .setalertform input#set_alert');
        if (NewIntraList.includes(val)) {
            typealert.style.border = "1px solid green";
            // console.log(val);
            setalertbutton.style.visibility = "visible";

        } else {
            typealert.style.border = "1px solid red";
            // console.log(val);

            setalertbutton.style.visibility = "hidden";

        }
    })

}
getIntradayData();

const tradablesymbol = document.querySelector('.container .togglewindow .market-overview .copy .clipboard');

tradablesymbol.addEventListener('click', function () {
    navigator.clipboard.writeText(document.querySelector('.container .togglewindow .market-overview .copy span').innerHTML);
    tradablesymbol.innerHTML = "COPIED !!";
    clickSound.play();

    setTimeout(() => {
        tradablesymbol.innerHTML = 'COPY';
    }, 1000);

})

// --------------------------End fetching intradaylist data from myApi----------------------------
// --------------------------Start setting alarms----------------------------






async function sendingstockrequirements() {
    let tradable = [];
    const intradayresponse = await fetch(intraday);
    const streakresponse = await fetch(streak);
    const intradaylist = await intradayresponse.json();
    const streakdata = await streakresponse.json();
    // console.log(streakdata);
    // console.log(intradaylist);

    const NewIntraList = []
    for (const key in intradaylist) {

        NewIntraList.push(key);
    }

    for (const key in streakdata) {
        streakdata[key].forEach((item) => {
            if (NewIntraList.includes(item)) {
                if (tradable.includes(item)) {

                } else {
                    tradable.push(item);
                    // console.log(item);

                }

            }

        })
    }

    let alerts = localStorage.getItem('alerts');
    let alertObj;

    if (alerts == null) {
        alertObj = [];
    } else {
        alertObj = JSON.parse(alerts);

    }

    alertObj.forEach((alert) => {
        const sym = alert.SYMBOL;

        if (tradable.includes(sym)) {

        } else {
            tradable.push(sym);
            // console.log(item);

        }

    })

    const instruments = [];
    tradable.forEach((item) => {
        if (item.includes('&amp;')) {
            const instrument = item.replace("&amp;", "&");
            instruments.push(instrument);
        } else {
            instruments.push(item);
        }
    })
    // console.log(instruments);




    let symbols = [];
    for (let i = 0; i < instruments.length; i++) {
        const symb = instruments[i];
        const symbo = 'NSE:' + symb;
        symbols.push(symbo);

    }
    // console.log(symbols);
    const options = {
        method: 'POST',
        Headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(symbols)


    }
    const postinstruments = await fetch(requireinstruments, options);
    const result = await postinstruments.json();
    // console.log(result);
    if (!(result.status == 'success')) {
        alert('Required Instrument list is not updating')
    }

}
sendingstockrequirements();
setInterval(sendingstockrequirements, 1000);


async function balance() {
    const response = await fetch(live_balance);
    const data = await response.text();
    // console.log(data);
    document.querySelector('.container .togglewindow .market-overview .balance .amount').innerHTML = Number(data);
}
balance();
setInterval(balance, 1000);

async function filter_show_Streak_Alert_stocks() {

    const intradayresponse = await fetch(intraday);
    const streakresponse = await fetch(streak);
    const requiredresponse = await fetch(requiredstockdata);
    const intradaylist = await intradayresponse.json();
    const streakdata = await streakresponse.json();
    const requireddata = await requiredresponse.json();
    // console.log(streakdata);
    // console.log(intradaylist);
    // console.log(requireddata);

    const NewIntraList = []
    for (const key in intradaylist) {

        NewIntraList.push(key);
    }
    const getstocks = [];
    for (const key in requireddata) {
        getstocks.push(key);
    }
    // console.log(getstocks);




    const QualifiedStocks = new Object();
    for (const key in streakdata) {
        const listItems = new Object();
        QualifiedStocks[`${key}`] = listItems;
        if (key.includes('up')) {

            streakdata[key].forEach((element) => {
                if (NewIntraList.includes(element)) {
                    if (getstocks.includes(element)) {
                        const stockdata = requireddata[element];
                        const pmg = stockdata.pre_open_change;
                        const bs_diff = stockdata.buy_sell_order_diff;
                        const dfuc = stockdata.distance_from_ucl;
                        const dflc = stockdata.distance_from_lcl;
                        const dfh = stockdata.distance_from_high;
                        const dfl = stockdata.distance_from_low;
                        const chng = stockdata.change;
                        const margin = stockdata.margin_multiplier;
                        const ltp = stockdata.last_traded_price;

                        if (((pmg <= 3) && (pmg >= -3)) && (bs_diff > 1000) && (dfuc >= 3) && (dfh <= 3) && (chng > -3) && (margin > 4)) {
                            const balance = Number(document.querySelector('.container .togglewindow .market-overview .balance .amount').innerHTML);
                            const Quantity = ((balance * margin) / ltp).toFixed(0);
                            stockdata['tradable_quantity'] = Number(Quantity);
                            listItems[element] = stockdata;

                        }
                    } else {
                        // alert(`stock data is not available for ${element}`);
                        console.log(`stock data is not available for ${element}`);
                    }

                }

            })
        } else if (key.includes('down')) {
            streakdata[key].forEach((element) => {
                if (NewIntraList.includes(element)) {
                    if (getstocks.includes(element)) {
                        const stockdata = requireddata[element];
                        const pmg = stockdata.pre_open_change;
                        const bs_diff = stockdata.buy_sell_order_diff;
                        const dfuc = stockdata.distance_from_ucl;
                        const dflc = stockdata.distance_from_lcl;
                        const dfh = stockdata.distance_from_high;
                        const dfl = stockdata.distance_from_low;
                        const chng = stockdata.change;
                        const margin = stockdata.margin_multiplier;
                        const ltp = stockdata.last_traded_price;
                        // console.log(dfuc,dflc,pmg,bs_diff,dfh,dfl,chng,margin,ltp);
                        if (((pmg <= 3) && (pmg >= -3)) && (bs_diff < -1000) && (dflc >= 3) && (dfl <= 3) && (chng < 3) && (margin > 4)) {
                            const balance = Number(document.querySelector('.container .togglewindow .market-overview .balance .amount').innerHTML);
                            const Quantity = ((balance * margin) / ltp).toFixed(0);
                            stockdata['tradable_quantity'] = Number(Quantity);
                            listItems[element] = stockdata;

                        }
                    } else {
                        // alert(`stock data is not available for ${element}`);
                        console.log(`stock data is not available for ${element}`);

                    }

                }

            })
        } else {
            streakdata[key].forEach((element) => {
                if (NewIntraList.includes(element)) {
                    if (getstocks.includes(element)) {
                        const stockdata = requireddata[element];
                        const pmg = stockdata.pre_open_change;
                        const bs_diff = stockdata.buy_sell_order_diff;
                        const dfuc = stockdata.distance_from_ucl;
                        const dflc = stockdata.distance_from_lcl;
                        const dfh = stockdata.distance_from_high;
                        const dfl = stockdata.distance_from_low;
                        const chng = stockdata.change;
                        const margin = stockdata.margin_multiplier;
                        const ltp = stockdata.last_traded_price;
                        if (((pmg <= 3) && (pmg >= -3)) && (dflc >= 3) && (dfuc >= 3) && (margin > 4)) {
                            const balance = Number(document.querySelector('.container .togglewindow .market-overview .balance .amount').innerHTML);
                            const Quantity = ((balance * margin) / ltp).toFixed(0);
                            stockdata['tradable_quantity'] = Number(Quantity);
                            listItems[element] = stockdata;

                        }
                    } else {
                        // alert(`stock data is not available for ${element}`);
                        console.log(`stock data is not available for ${element}`);

                    }

                }

            })

        }
    }
    // console.log(QualifiedStocks);


    for (const key in QualifiedStocks) {
        if (key.includes('up')) {
            const tab = document.querySelectorAll('.togglewindow>.buy-now>.tab-wrap-buy> li');
            const window = document.querySelector('.togglewindow>.buy-now>.tab-wrap-buy').innerHTML;
            if ((tab.length == 0) || (!window.includes(key))) {
                const buy_signals = document.querySelector('.togglewindow>.buy-now>.tab-wrap-buy');
                const tabelem = document.createElement('li');
                tabelem.className = `${key}`;
                tabelem.innerHTML = `
    <input type="radio" name="scanner-buy" id="${key}"  />
    <label for="${key}">${key}<span>${Object.keys(QualifiedStocks[key]).length}</span></label>
    <div class="scanner-content-table">
    <table>
    <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Sector</th>
                    <th>LTP</th>
                    <th>PRE-OPEN</th>
                    <th>Change</th>
                    <th>Quantity</th>
                    <th>Vol. Gap</th>
                    <th>Actions</th>
                </tr>
    </thead>
    <tbody>    
    </tbody>
    </table>
                 </div>`;

                const buy_list = tabelem.querySelector(`.scanner-content-table tbody`);
                for (const item in QualifiedStocks[key]) {
                    // console.log(QualifiedStocks[key][item]);
                    const symbol = QualifiedStocks[key][item];
                    const rows = document.createElement('tr');
                    const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                    rows.setAttribute('id', rowid);
                    rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                    rows.innerHTML = `
                          <td>${item}</td>
                          <td>${symbol.sector}</td>
                          <td>${symbol.last_traded_price}</td>
                          <td>${symbol.pre_open_change}</td>
                          <td>${symbol.change}</td>
                          <td>${symbol.tradable_quantity}</td>
                          <td>${symbol.buy_sell_order_diff}</td>
                          <td>
                          <span class="buyButt">BUY</span>
                          <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                          <span class="sellButt">SELL</span>
                          </td>
                          `
                    buy_list.appendChild(rows);

                }
                // QualifiedStocks[key].forEach((element) => {
                //     const rows = document.createElement('tr');
                //     rows.innerHTML = `
                //           <td>${element['Stock Symbol']}</td>
                //           <td>${element['Last Traded Price']}</td>
                //           <td>${element['Change']}</td>
                //           <td>${element['Pre-Market Gap']}</td>
                //           <td>${element['Tradable Quantity']}</td>
                //           <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                //     buy_list.appendChild(rows);
                // })
                buy_signals.appendChild(tabelem);
            } else {
                for (let i = 0; i < tab.length; i++) {
                    const tabmname = tab[i].innerHTML;
                    // console.log(tabmname, i);
                    // console.log(key);
                    if (tabmname.includes(key)) {
                        const target = tab[i].querySelector(`.scanner-content-table table`);
                        const list = target.children[1];
                        // console.log(list);
                        const tableBody = document.createElement('tbody');
                        for (const item in QualifiedStocks[key]) {
                            const symbol = QualifiedStocks[key][item];
                            const rows = document.createElement('tr');
                            const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                            rows.setAttribute('id', rowid);
                            rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                            rows.innerHTML = `
                          <td>${item}</td>
                          <td>${symbol.sector}</td>
                          <td>${symbol.last_traded_price}</td>
                          <td>${symbol.pre_open_change}</td>
                          <td>${symbol.change}</td>
                          <td>${symbol.tradable_quantity}</td>
                          <td>${symbol.buy_sell_order_diff}</td>
                          <td>
                          <span class="buyButt">BUY</span>
                          <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                          <span class="sellButt">SELL</span>
                          </td>
                          `
                            tableBody.appendChild(rows);
                        }
                        // QualifiedStocks[key].forEach((element) => {
                        //     const rows = document.createElement('tr');
                        //     rows.innerHTML = `
                        //       <td>${element['Stock Symbol']}</td>
                        //       <td>${element['Last Traded Price']}</td>
                        //       <td>${element['Change']}</td>
                        //       <td>${element['Pre-Market Gap']}</td>
                        //       <td>${element['Tradable Quantity']}</td>
                        //       <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                        //     tableBody.appendChild(rows);
                        // })
                        target.replaceChild(tableBody, list);


                    }
                }
            }

        } else if (key.includes('down')) {

            const tab = document.querySelectorAll('.togglewindow>.sell-now>.tab-wrap-sell> li');
            const window = document.querySelector('.togglewindow>.sell-now>.tab-wrap-sell').innerHTML;
            if ((tab.length == 0) || (!window.includes(key))) {
                const buy_signals = document.querySelector('.togglewindow>.sell-now>.tab-wrap-sell');
                const tabelem = document.createElement('li');
                tabelem.className = `${key}`;
                tabelem.innerHTML = `
    <input type="radio" name="scanner-sell" id="${key}"  />
    <label for="${key}">${key}<span>${Object.keys(QualifiedStocks[key]).length}</span></label>
    <div class="scanner-content-table">
    <table>
    <thead>
    <tr>
    <th>Symbol</th>
    <th>Sector</th>
    <th>LTP</th>
    <th>PRE-OPEN</th>
    <th>Change</th>
    <th>Quantity</th>
    <th>Vol. Gap</th>
    <th>Actions</th>
</tr>
    </thead>
    <tbody>    
    </tbody>
    </table>
                 </div>`;

                const buy_list = tabelem.querySelector(`.scanner-content-table tbody`);
                for (const item in QualifiedStocks[key]) {
                    // console.log(QualifiedStocks[key][item]);
                    const symbol = QualifiedStocks[key][item];
                    const rows = document.createElement('tr');
                    const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                    rows.setAttribute('id', rowid);
                    rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                    rows.innerHTML = `
                          <td>${item}</td>
                          <td>${symbol.sector}</td>
                          <td>${symbol.last_traded_price}</td>
                          <td>${symbol.pre_open_change}</td>
                          <td>${symbol.change}</td>
                          <td>${symbol.tradable_quantity}</td>
                          <td>${symbol.buy_sell_order_diff}</td>
                          <td>
                          <span class="buyButt">BUY</span>
                          <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                          <span class="sellButt">SELL</span>
                          </td>
                          `
                    buy_list.appendChild(rows);

                }

                // QualifiedStocks[key].forEach((element) => {
                //     const rows = document.createElement('tr');
                //     rows.innerHTML = `
                //           <td>${element['Stock Symbol']}</td>
                //           <td>${element['Last Traded Price']}</td>
                //           <td>${element['Change']}</td>
                //           <td>${element['Pre-Market Gap']}</td>
                //           <td>${element['Tradable Quantity']}</td>
                //           <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                //     buy_list.appendChild(rows);
                // })
                buy_signals.appendChild(tabelem);
            } else {
                for (let i = 0; i < tab.length; i++) {
                    const tabmname = tab[i].innerHTML;
                    // console.log(tabmname, i);
                    // console.log(key);
                    if (tabmname.includes(key)) {
                        const target = tab[i].querySelector(`.scanner-content-table table`);
                        const list = target.children[1];
                        // console.log(list);
                        const tableBody = document.createElement('tbody');
                        for (const item in QualifiedStocks[key]) {
                            // console.log(QualifiedStocks[key][item]);
                            const symbol = QualifiedStocks[key][item];
                            const rows = document.createElement('tr');
                            const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                            rows.setAttribute('id', rowid);
                            rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                            rows.innerHTML = `
                          <td>${item}</td>
                          <td>${symbol.sector}</td>
                          <td>${symbol.last_traded_price}</td>
                          <td>${symbol.pre_open_change}</td>
                          <td>${symbol.change}</td>
                          <td>${symbol.tradable_quantity}</td>
                          <td>${symbol.buy_sell_order_diff}</td>
                          <td>
                          <span class="buyButt">BUY</span>
                          <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                          <span class="sellButt">SELL</span>
                          </td>
                          `
                            tableBody.appendChild(rows);

                        }
                        // QualifiedStocks[key].forEach((element) => {
                        //     const rows = document.createElement('tr');
                        //     rows.innerHTML = `
                        //       <td>${element['Stock Symbol']}</td>
                        //       <td>${element['Last Traded Price']}</td>
                        //       <td>${element['Change']}</td>
                        //       <td>${element['Pre-Market Gap']}</td>
                        //       <td>${element['Tradable Quantity']}</td>
                        //       <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                        //     tableBody.appendChild(rows);
                        // })
                        target.replaceChild(tableBody, list);


                    }
                }
            }

        } else {

            const tab = document.querySelectorAll('.togglewindow>.buy-sell>.tab-wrap-buy-sell> li');
            const window = document.querySelector('.togglewindow>.buy-sell>.tab-wrap-buy-sell').innerHTML;
            if ((tab.length == 0) || (!window.includes(key))) {
                const buy_signals = document.querySelector('.togglewindow>.buy-sell>.tab-wrap-buy-sell');
                const tabelem = document.createElement('li');
                tabelem.className = `${key}`;
                tabelem.innerHTML = `
    <input type="radio" name="scanner-buysell" id="${key}"  />
    <label for="${key}">${key}<span>${Object.keys(QualifiedStocks[key]).length}</span></label>
    <div class="scanner-content-table">
    <table>
    <thead>
                <tr>
                <th>Symbol</th>
                <th>Sector</th>
                <th>LTP</th>
                <th>PRE-OPEN</th>
                <th>Change</th>
                <th>Quantity</th>
                <th>Vol. Gap</th>
                <th>Actions</th>
                </tr>
    </thead>
    <tbody>    
    </tbody>
    </table>
                 </div>`;

                const buy_list = tabelem.querySelector(`.scanner-content-table tbody`);
                for (const item in QualifiedStocks[key]) {
                    // console.log(QualifiedStocks[key][item]);
                    const symbol = QualifiedStocks[key][item];
                    const rows = document.createElement('tr');
                    const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                    rows.setAttribute('id', rowid);
                    rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                    rows.innerHTML = `
                          <td>${item}</td>
                          <td>${symbol.sector}</td>
                          <td>${symbol.last_traded_price}</td>
                          <td>${symbol.pre_open_change}</td>
                          <td>${symbol.change}</td>
                          <td>${symbol.tradable_quantity}</td>
                          <td>${symbol.buy_sell_order_diff}</td>
                          <td>
                          <span class="buyButt">BUY</span>
                          <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                          <span class="sellButt">SELL</span>
                          </td>
                          `
                    buy_list.appendChild(rows);

                }
                // QualifiedStocks[key].forEach((element) => {
                //     const rows = document.createElement('tr');
                //     rows.innerHTML = `
                //           <td>${element['Stock Symbol']}</td>
                //           <td>${element['Last Traded Price']}</td>
                //           <td>${element['Change']}</td>
                //           <td>${element['Pre-Market Gap']}</td>
                //           <td>${element['Tradable Quantity']}</td>
                //           <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                //     buy_list.appendChild(rows);
                // })
                buy_signals.appendChild(tabelem);
            } else {
                for (let i = 0; i < tab.length; i++) {
                    const tabmname = tab[i].innerHTML;
                    // console.log(tabmname, i);
                    // console.log(key);
                    if (tabmname.includes(key)) {
                        const target = tab[i].querySelector(`.scanner-content-table table`);
                        const list = target.children[1];
                        // console.log(list);
                        const tableBody = document.createElement('tbody')
                        for (const item in QualifiedStocks[key]) {
                            // console.log(QualifiedStocks[key][item]);
                            const symbol = QualifiedStocks[key][item];
                            const rows = document.createElement('tr');
                            const rowid = `${item}_${key.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`;
                            rows.setAttribute('id', rowid);
                            rows.setAttribute('onclick', 'showDetailInformation(this.id)');
                            rows.innerHTML = `
                                  <td>${item}</td>
                                  <td>${symbol.sector}</td>
                                  <td>${symbol.last_traded_price}</td>
                                  <td>${symbol.pre_open_change}</td>
                                  <td>${symbol.change}</td>
                                  <td>${symbol.tradable_quantity}</td>
                                  <td>${symbol.buy_sell_order_diff}</td>
                                  <td>
                                  <span class="buyButt">BUY</span>
                                  <span class="alarmButt"><i class="fas fa-stopwatch"></i></span>
                                  <span class="sellButt">SELL</span>
                                  </td>
                                  `
                            tableBody.appendChild(rows);

                        }
                        // QualifiedStocks[key].forEach((element) => {
                        //     const rows = document.createElement('tr');
                        //     rows.innerHTML = `
                        //       <td>${element['Stock Symbol']}</td>
                        //       <td>${element['Last Traded Price']}</td>
                        //       <td>${element['Change']}</td>
                        //       <td>${element['Pre-Market Gap']}</td>
                        //       <td>${element['Tradable Quantity']}</td>
                        //       <td>${element['Total Buy Orders'] - element['Total Sell Orders']}</td>`
                        //     tableBody.appendChild(rows);
                        // })
                        target.replaceChild(tableBody, list);


                    }
                }
            }

        }

    }


    const tab1 = document.querySelectorAll('ul[class*=tab-wrap] > li:nth-child(1)>input');
    tab1.forEach((element) => {
        element.setAttribute('checked', 'checked');
    })

    const buytab = document.querySelectorAll('ul[class="tab-wrap-buy"] > li');
    let buyalertnum = Number();
    buytab.forEach((item) => {
        const alerts_no = Number(item.querySelector('label >span').innerHTML);
        // console.log(alerts_no);
        buyalertnum += alerts_no
    })
    // console.log(buyalertnum);
    document.querySelector('.container .menulist .sidemenu .buy span.total-items').innerHTML = buyalertnum;


    const selltab = document.querySelectorAll('ul[class="tab-wrap-sell"] > li');
    let sellalertnum = Number();
    selltab.forEach((item) => {
        const alerts_no = Number(item.querySelector('label >span').innerHTML);
        // console.log(alerts_no);
        sellalertnum += alerts_no
    })
    // console.log(sellalertnum);
    document.querySelector('.container .menulist .sidemenu .sell span.total-items').innerHTML = sellalertnum;


    const buy_selltab = document.querySelectorAll('ul[class="tab-wrap-buy-sell"] > li');
    let buy_sellalertnum = Number();
    buy_selltab.forEach((item) => {
        const alerts_no = Number(item.querySelector('label >span').innerHTML);
        // console.log(alerts_no);
        buy_sellalertnum += alerts_no
    })
    // console.log(buy_sellalertnum);
    document.querySelector('.container .menulist .sidemenu .buy_sell span.total-items').innerHTML = buy_sellalertnum;



    const Copysymls = document.querySelectorAll(".scanner-content-table>table>tbody> tr>td:nth-child(1)");
    Copysymls.forEach((item) => item.addEventListener('click', function () {
        navigator.clipboard.writeText(item.innerHTML.replace('&amp;', '&'));
        item.style.borderRadius = '20px';
        item.style.color = "black";
        item.style.backgroundColor = "#FFA500";
        item.style.fontWeight = 'bold';
        clickSound.play();

        setTimeout(function () {
            item.style.backgroundColor = "";
            item.style.fontWeight = 'normal';
            item.style.borderRadius = '0px';
            item.style.color = '';
        }, 1000)
    }))

    const CopyQuan = document.querySelectorAll(".scanner-content-table>table>tbody> tr>td:nth-child(6)");
    CopyQuan.forEach((item) => item.addEventListener('click', function () {
        navigator.clipboard.writeText(item.innerHTML);

        item.style.borderRadius = '20px';
        item.style.color = "black";
        item.style.backgroundColor = "#FFA500";
        item.style.fontWeight = 'bold';
        clickSound.play();

        setTimeout(function () {
            item.style.backgroundColor = "";
            item.style.fontWeight = 'normal';
            item.style.borderRadius = '0px';
            item.style.color = '';
        }, 1000)
    }))

    const chngColor = document.querySelectorAll(".scanner-content-table>table>tbody> tr>td:nth-child(5)");
    const gapColor = document.querySelectorAll(".scanner-content-table>table>tbody> tr>td:nth-child(4)");
    const Ord_diffColor = document.querySelectorAll(".scanner-content-table>table>tbody> tr>td:nth-child(7)");

    chngColor.forEach((item) => {
        const num = Number(item.innerHTML);

        if (num > 0) {
            item.style.color = "#4987ee";

        } else if (num < 0) {
            item.style.color = "#e25f5b";
        }

    })

    gapColor.forEach((item) => {
        const num = Number(item.innerHTML);

        if (num > 0) {
            item.style.color = "#4987ee";

        } else if (num < 0) {
            item.style.color = "#e25f5b";
        }

    })

    Ord_diffColor.forEach((item) => {
        const num = Number(item.innerHTML);

        if (num > 0) {
            item.style.color = "#4987ee";

        } else if (num < 0) {
            item.style.color = "#e25f5b";
        }

    })


}
filter_show_Streak_Alert_stocks();
setInterval(filter_show_Streak_Alert_stocks, 1000);





// --------------------------------------- Alarm tab configuration **START** --------------------------------------------





const set_alert = document.getElementById('set_alert');
set_alert.addEventListener('click', function () {

    let SYMBOL = document.getElementById('SYMBOL');
    let ALERT_PRICE = document.getElementById('ALERT_PRICE');
    let ALERT_TYPE = document.getElementById('ALERT_TYPE');
    let MESSAGE = document.getElementById('MESSAGE');
    let alerts = localStorage.getItem('alerts');
    let alertObj;
    if (alerts == null) {
        alertObj = [];
    } else {
        alertObj = JSON.parse(alerts);

    }
    const alertData = new Object();
    if ((SYMBOL.value != '') && (ALERT_PRICE.value != '') && (ALERT_TYPE.value != '') && (MESSAGE.value != '')) {
        alertData['SYMBOL'] = SYMBOL.value.toUpperCase();
        alertData['ALERT_PRICE'] = Number(ALERT_PRICE.value);
        alertData['ALERT_TYPE'] = ALERT_TYPE.value;
        alertData['MESSAGE'] = MESSAGE.value;
        alertObj.push(alertData);
        localStorage.setItem('alerts', JSON.stringify(alertObj));

    } else {
        window.alert('Please fill all the inputs')
    }
    SYMBOL.value = '';
    ALERT_PRICE.value = '';
    ALERT_TYPE.value = '';
    MESSAGE.value = '';
    // console.log(alertObj);
    clickSound.play();


})

async function alertcontrol() {
    const requiredresponse = await fetch(requiredstockdata);
    const requireddata = await requiredresponse.json();
    // console.log(requireddata)



    function showAlerts(requireddata) {
        let alerts = localStorage.getItem('alerts');
        let alertObj;

        if (alerts == null) {
            alertObj = [];
        } else {
            alertObj = JSON.parse(alerts);

        }
        const alertBody = document.createElement('tbody');
        alertObj.forEach((elem, index) => {
            const SYMBOL = elem['SYMBOL'];
            const ALERT_PRICE = elem['ALERT_PRICE'];
            // requireddata.forEach((element) => {***************************
            for (const symbol in requireddata) {

                const datasymb = symbol;
                const ltp = requireddata[symbol].last_traded_price;
                if (SYMBOL == datasymb) {
                    elem['LTP'] = Number(ltp);
                    if ((elem['ALERT_TYPE'] == 'Crossing-Up') && (ltp > ALERT_PRICE)) {
                        const exsistingdivs = document.querySelectorAll('.uper> .popup ');
                        if (exsistingdivs.length == 0) {
                            const targDIV = document.querySelector('.uper');
                            const popup = document.createElement(`div`);
                            popup.className = 'popup';
                            const idname = `${SYMBOL.replace('&', '_').replace('-', '_') + elem['ALERT_TYPE'].replace('-', '_') + elem['ALERT_PRICE'].toString().replace('.', '_')}`;
                            popup.setAttribute('id', idname);
                            popup.innerHTML = `<div class="cross" onclick='alertclosingbutton(${idname})'><i class="fas fa-times-circle"></i></div>
                        <span><i class="fas fa-exclamation-triangle"></i></span>
                        <h6><span>${elem['SYMBOL']}  </span>Price ${elem['ALERT_TYPE']}</h6>
                        <p class="LTP"><span>LTP : </span>${elem['LTP']}</p>
                        <p class="target"><span>TARGET : </span>${elem['ALERT_PRICE']}</p>
                        <div class="message">
                          <p>
                            ${elem['MESSAGE']}
                          </p>
                        </div>`;
                            popup.style.backgroundColor = 'rgb(107, 231, 75)';
                            popup.style.zIndex = "30";
                            targDIV.appendChild(popup);
                            ringBell();
                        } else {

                            exsistingdivs.forEach(() => {
                                // console.log("lopping")
                                const targDIV = document.querySelector('.uper').innerHTML;
                                let targinner;
                                if (targDIV.includes('&amp;')) {
                                    targinner = targDIV.replace('&amp;', '&');

                                } else {
                                    targinner = targDIV;

                                }
                                // console.log(targinner);
                                if (targinner.includes(SYMBOL)) {

                                } else {
                                    console.log(elem['SYMBOL']);
                                    const popup = document.createElement('div');
                                    popup.className = 'popup';
                                    const idname = `${SYMBOL.replace('&', '_').replace('-', '_') + elem['ALERT_TYPE'].replace('-', '_') + elem['ALERT_PRICE'].toString().replace('.', '_')}`;
                                    popup.setAttribute('id', idname);
                                    popup.innerHTML = `<div class="cross" onclick='alertclosingbutton(${idname})'><i class="fas fa-times-circle"></i></div>
                                <span><i class="fas fa-exclamation-triangle"></i></span>
                                <h6><span>${elem['SYMBOL']}  </span>Price ${elem['ALERT_TYPE']}</h6>
                                <p class="LTP"><span>LTP : </span>${elem['LTP']}</p>
                                <p class="target"><span>TARGET : </span>${elem['ALERT_PRICE']}</p>
                                <div class="message">
                                  <p>
                                    ${elem['MESSAGE']}
                                  </p>
                                </div>`;
                                    popup.style.backgroundColor = 'rgb(107, 231, 75)';
                                    popup.style.zIndex = "30";
                                    targDIV.appendChild(popup);
                                    ringBell();

                                }
                            })

                        }
                    } else if ((elem['ALERT_TYPE'] == 'Crossing-Down') && (ltp < ALERT_PRICE)) {
                        const exsistingdivs = document.querySelectorAll('.lwer> .popup ');
                        if (exsistingdivs.length == 0) {
                            const targDIV = document.querySelector('.lwer');
                            const popup = document.createElement('div');
                            popup.className = 'popup';
                            const idname = `${SYMBOL.replace('&', '_').replace('-', '_') + elem['ALERT_TYPE'].replace('-', '_') + elem['ALERT_PRICE'].toString().replace('.', '_')}`;
                            popup.setAttribute('id', idname);
                            popup.innerHTML = `<div class="cross" onclick='alertclosingbutton(${idname})'><i class="fas fa-times-circle"></i></div>
                        <span><i class="fas fa-exclamation-triangle"></i></span>
                        <h6><span>${elem['SYMBOL']}  </span>Price ${elem['ALERT_TYPE']}</h6>
                        <p class="LTP"><span>LTP : </span>${elem['LTP']}</p>
                        <p class="target"><span>TARGET : </span>${elem['ALERT_PRICE']}</p>
                        <div class="message">
                          <p>
                            ${elem['MESSAGE']}
                          </p>
                        </div>`;
                            popup.style.backgroundColor = 'rgb(223, 109, 2)';
                            popup.style.zIndex = "30";
                            targDIV.appendChild(popup);
                            ringBell();
                        } else {
                            exsistingdivs.forEach((div) => {
                                const targDIV = document.querySelector('.lwer').innerHTML;
                                let targinner;
                                if (targDIV.includes('&amp;')) {
                                    targinner = targDIV.replace('&amp;', '&');

                                } else {
                                    targinner = targDIV;

                                }
                                // console.log(targinner);
                                // console.log(SYMBOL);
                                if (targinner.includes(SYMBOL)) {
                                    // console.log('already alarming');
                                } else {
                                    const targDIV = document.querySelector('.lwer');
                                    const popup = document.createElement('div');
                                    popup.className = 'popup';
                                    const idname = `${SYMBOL.replace('&', '_').replace('-', '_') + elem['ALERT_TYPE'].replace('-', '_') + elem['ALERT_PRICE'].toString().replace('.', '_')}`;
                                    popup.setAttribute('id', idname);
                                    popup.innerHTML = `<div class="cross" onclick='alertclosingbutton(${idname})'><i class="fas fa-times-circle"></i></div>
                                <span><i class="fas fa-exclamation-triangle"></i></span>
                                <h6><span>${elem['SYMBOL']}  </span>Price ${elem['ALERT_TYPE']}</h6>
                                <p class="LTP"><span>LTP : </span>${elem['LTP']}</p>
                                <p class="target"><span>TARGET : </span>${elem['ALERT_PRICE']}</p>
                                <div class="message">
                                  <p>
                                    ${elem['MESSAGE']}
                                  </p>
                                </div>`;
                                    popup.style.backgroundColor = 'rgb(223, 109, 2)';
                                    popup.style.zIndex = "30";
                                    targDIV.appendChild(popup);
                                    ringBell();

                                }

                            })
                        }









                    } else {
                        // console.log('waiting for alert');

                    }
                } else {
                    // console.log('waiting for match');
                }

            }

            // })**********************************
            const LTP = elem['LTP'];
            const alertRow = document.createElement("tr");
            alertRow.setAttribute('id', `${elem['SYMBOL']}_${elem['ALERT_PRICE'].toString().replace('.', '_')}`)
            alertRow.setAttribute('onclick', 'showDetailInformation(this.id)')
            alertRow.innerHTML = `<td>${elem['SYMBOL']}</td>
        <td>${elem['ALERT_PRICE']}</td>
        <td>${elem['LTP']}</td>
        <td>${elem['ALERT_TYPE']}</td>
        <td><dfn title="helofgg">${elem['MESSAGE']}</dfn></td>
        <td class='${index}'><i class="far fa-edit"></i></td>
        <td class='${index}'><i class="fas fa-trash-alt"></i></td>`
            alertBody.appendChild(alertRow);


        })
        const targtTable = document.querySelector('.set-alarm > .aler_history > table');
        const oldBody = targtTable.children[1];
        targtTable.replaceChild(alertBody, oldBody);

    }
    showAlerts(requireddata);


    try {
        const alamingStocks = document.querySelectorAll('.popup');
        alamingStocks.forEach((item) => {
            const alamingStock = item.querySelector('h6>span');
            alamingStock.addEventListener('click', function () {
                navigator.clipboard.writeText(alamingStock.innerHTML.replace('&amp;', '&').trim());
                alamingStock.style.backgroundColor = 'black'
                setTimeout(function () {
                    alamingStock.style.backgroundColor = '';

                }, 1000)
            })
        })

    } catch { }

    const messagerow = document.querySelectorAll('.set-alarm .aler_history table> tbody> tr');
    messagerow.forEach((row) => {
        const message = row.querySelector('td:nth-child(5)> dfn').innerHTML;
        row.querySelector('td:nth-child(5)> dfn').setAttribute('title', message);


    })

    const deletealert = document.querySelectorAll('.set-alarm .aler_history table> tbody> tr> td:nth-child(7)');
    deletealert.forEach((item) => {
        item.addEventListener('click', function () {
            const index = item.getAttribute('class');

            let alerts = localStorage.getItem('alerts');
            let alertObj = JSON.parse(alerts);
            alertObj.splice(index, 1);
            localStorage.setItem('alerts', JSON.stringify(alertObj));
        })
    })

    const editalert = document.querySelectorAll('.set-alarm .aler_history table> tbody> tr> td:nth-child(6)')
    editalert.forEach((item) => {
        item.addEventListener('click', function () {
            const index = item.getAttribute('class');
            let alerts = localStorage.getItem('alerts');
            let alertObj = JSON.parse(alerts);
            const alarm = alertObj[index];
            let SYMBOL = document.getElementById('SYMBOL');
            let ALERT_PRICE = document.getElementById('ALERT_PRICE');
            let ALERT_TYPE = document.getElementById('ALERT_TYPE');
            let MESSAGE = document.getElementById('MESSAGE');
            SYMBOL.value = alarm['SYMBOL'];
            ALERT_PRICE.value = alarm['ALERT_PRICE'];
            ALERT_TYPE.value = alarm['ALERT_TYPE'];
            MESSAGE.value = alarm['MESSAGE'];
            alertObj.splice(index, 1);
            localStorage.setItem('alerts', JSON.stringify(alertObj));

        })
    })



}
alertcontrol();
setInterval(alertcontrol, 1000);

function prevent2ndtimealert(type) {
    // console.log(type);
    if (type.includes('Crossing-Up')) {
        const alerts = localStorage.getItem('alerts');
        const alertObj = JSON.parse(alerts);
        alertObj.forEach((elem) => {
            const SYMBOL = elem['SYMBOL'];
            console.log(SYMBOL);

            if (type.includes(SYMBOL)) {
                elem['ALERT_PRICE'] = 200000;
                pauseBell();

            } else {
                // console.log('error');
            }
        })
        localStorage.setItem('alerts', JSON.stringify(alertObj));


    } else if (type.includes('Crossing-Down')) {
        const alerts = localStorage.getItem('alerts');
        const alertObj = JSON.parse(alerts);
        alertObj.forEach((elem) => {
            const SYMBOL = elem['SYMBOL'];
            if (type.includes(SYMBOL)) {
                elem['ALERT_PRICE'] = 0;
                pauseBell();
            } else {
                // console.log('error')
            }
        })
        localStorage.setItem('alerts', JSON.stringify(alertObj));
    }
}

function alertclosingbutton(idname) {
    const type = idname.querySelector('h6').innerHTML.replace('&amp;', '&');
    prevent2ndtimealert(type);
    idname.remove();
    clickSound.play();

    // console.log('item removed');

}

function pauseBell() {
    audio.pause();
}

function ringBell() {
    audio.play();
}





// --------------------------------------- Alarm tab configuration **END** --------------------------------------------


const InfoDiv = document.getElementById('DetailInformation');
function onDrag({ movementX: e, movementY: r }) {
    let getStyle = window.getComputedStyle(InfoDiv);
    // console.log(getStyle);
    let Lft = parseInt(getStyle.left);
    let toop = parseInt(getStyle.top);
    let botm = parseInt(getStyle.bottom);
    // console.log(e, r);
    InfoDiv.style.bottom = `${botm - r}px`;
    InfoDiv.style.left = `${Lft + e}px`;
    // InfoDiv.style.top = `${toop + r}px`;

}


InfoDiv.addEventListener('mousedown', () => {
    InfoDiv.classList.add("draging");
    const tagetdiv = document.getElementById('DetailInformation');
    tagetdiv.style.transition = 'none';
    InfoDiv.addEventListener('mousemove', onDrag);
});

document.addEventListener("mouseup", () => {
    InfoDiv.classList.remove("draging");
    InfoDiv.removeEventListener("mousemove", onDrag);
});


function showDetailInformation(id) {
    let reqSymbol = id.split('_')[0];
    // console.log(reqSymbol);
    const query = document.getElementById('query');
    query.innerHTML = reqSymbol;
    clickSound.play();
    const tagetdiv = document.getElementById('DetailInformation');
    tagetdiv.style.transition = 'all 0.5s ease-out 0s';
    tagetdiv.style.bottom = '0';
    // tagetdiv.style.transition = 'none';

}


async function updatedetailinfo() {
    const reqSymbol = document.getElementById('query').innerHTML.replace('&amp;', '&');
    // console.log(typeof (reqSymbol));
    if (reqSymbol == '') {
        // console.log('not found');

    } else {

        const response = await fetch(requiredstockdata);
        const bulkData = await response.json();
        // console.log(bulkData);

        for (const key in bulkData) {
            if (key == reqSymbol) {
                // console.log(bulkData[key]);
                const stockData = bulkData[key];
                const cash = Number(document.querySelector('.amount').innerHTML);
                const dailystuff = document.querySelector('#DetailInformation .dailystuff');
                dailystuff.innerHTML = `
        <div class="left">
      <table>
        <!-- <thead></thead> -->
        <tbody>
          <tr>
            <td>symbol</td>
            <td>${key}</td>
          </tr>
          <tr>
            <td>ltp</td>
            <td>${stockData.last_traded_price}</td>
          </tr>
          <tr>
            <td>change</td>
            <td>${stockData.change}%</td>
          </tr>
          <tr>
            <td>open</td>
            <td>${stockData.open}</td>
          </tr>
          <tr>
            <td>high</td>
            <td>${stockData.high}</td>
          </tr>
          <tr>
            <td>ucl</td>
            <td>${stockData.upper_circuit_limit}</td>
          </tr>
          <tr>
            <td>ltq</td>
            <td>${stockData.last_traded_quantity}</td>
          </tr>
          <tr>
            <td>vol. gap</td>
            <td>${stockData.buy_sell_order_diff}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="right">
      <table>
        <!-- <thead></thead> -->
        <tbody>
          <tr>
            <td>inst. no.</td>
            <td>${stockData.instrument_token}</td>
          </tr>
          <tr>
            <td>avg. price</td>
            <td>${stockData.average_price}</td>
          </tr>

          <tr>
            <td>pre-mar. gap</td>
            <td>${stockData.pre_open_change}%</td>
          </tr>
          <tr>
            <td>prev. close</td>
            <td>${stockData.prev_close}</td>
          </tr>
          <tr>
            <td>low</td>
            <td>${stockData.low}</td>
          </tr>
          <tr>
            <td>lcl</td>
            <td>${stockData.lower_circuit_limit}</td>
          </tr>
          <tr>
            <td>margin</td>
            <td>${stockData.margin_multiplier}10</td>
          </tr>
          <tr>
            <td>quantity</td>
            <td>${((cash * stockData.margin_multiplier) / stockData.last_traded_price).toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bottom">
      <span class="week"><p>52 weeks</p></span>
      <div class="design">
        <div class="indicator"></div>
      </div>
      <span class="lp">81000.59</span>
      <span class="hp">81059.59</span>
      <span class="low">low</span>
      <span class="high">high</span>
    </div>


        `;
                const buymarketdepthlist = document.querySelector('#DetailInformation .marketdepth .ask table tbody');
                let buyrows = '';
                stockData.market_depth_buy.forEach((item) => {
                    buyrows += `
            <tr>
            <td>${item.price}</td>
            <td>${item.orders}</td>
            <td>${item.quantity}</td>
            </tr>
            `;

                })
                // console.log(buyrows);
                buymarketdepthlist.innerHTML = buyrows;
                const buymarketdepthtotal = document.querySelector('#DetailInformation .marketdepth .ask table tfoot tr td:nth-child(2)');
                buymarketdepthtotal.innerHTML = stockData.total_buy_quantity;
                const sellmarketdepthtotal = document.querySelector('#DetailInformation .marketdepth .offer table tfoot tr td:nth-child(2)');
                sellmarketdepthtotal.innerHTML = stockData.total_sell_quantity;
                const sellmarketdepthlist = document.querySelector('#DetailInformation .marketdepth .offer table tbody');
                let sellrows = '';
                stockData.market_depth_sell.forEach((item) => {
                    sellrows += `
            <tr>
            <td>${item.price}</td>
            <td>${item.orders}</td>
            <td>${item.quantity}</td>
            </tr>
            `;

                })
                // console.log(sellrows);
                sellmarketdepthlist.innerHTML = sellrows;




            }

        }
    }


}
updatedetailinfo();
setInterval(updatedetailinfo, 1000);

function cleardetailInfo() {
    const tagetdiv = document.getElementById('DetailInformation');
    const query = document.getElementById('query');
    query.innerHTML = '';
    tagetdiv.style.transition = 'all 0.5s ease-out 0s';
    tagetdiv.style.bottom = '300%';
    tagetdiv.style.left = '10%';
    // tagetdiv.style.transition = 'none';
    clickSound.play();

}





































let li = document.querySelectorAll('.menu');
li.forEach((item) => item.addEventListener('click', activeLINK))
function activeLINK() {

    li.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');

}

const windowTab = document.querySelectorAll(".togglewindow> div");

const overview = document.querySelector(".market");
overview.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.market-overview').style.zIndex = '3'
});

const buy = document.querySelector(".buy");
buy.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.buy-now').style.zIndex = '3';
});

const sell = document.querySelector(".sell");
sell.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.sell-now').style.zIndex = '3';
});

const buy_sell = document.querySelector(".buy_sell");
buy_sell.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.buy-sell').style.zIndex = '3';
});

const alarms = document.querySelector(".alarms");
alarms.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.set-alarm').style.zIndex = '3';
});

const history = document.querySelector(".history");
history.addEventListener('click', function () {
    windowTab.forEach((item) => { item.style.zIndex = '2' })
    document.querySelector('.trading-history').style.zIndex = '3';
});