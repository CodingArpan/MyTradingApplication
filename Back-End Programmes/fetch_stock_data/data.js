const fs = require('fs');
var KiteConnect = require("kiteconnect").KiteConnect;

var kc = new KiteConnect({
    api_key: "dj5idpkbo93l81yz"
});
const kitesession = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/read.txt").toString());
kc.setAccessToken(kitesession.access_token);
setInterval(() => {
    try {


        let account_balance;
        kc.getMargins()
            .then(function (response) {
                // You got user's margin details.
                // console.log(response);
                account_balance = response.equity.available.live_balance;
                // console.log(account_balance);
                fs.writeFileSync('E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/live_balance.txt', JSON.stringify(account_balance), function (err) {
                    if (err) throw err;
                    console.log("live_balance.txt created");
                });
            }).catch(function (err) {

            });

        // const instruments = ['NSE:LTTS',
        //     'NSE:LUMAXIND',
        //     'NSE:LUMAXTECH',
        //     'NSE:LUPIN',
        //     'NSE:LUXIND',
        //     'NSE:LXCHEM',
        //     'NSE:LYKALABS',
        //     'NSE:LYPSAGEMS',
        //     'NSE:M&M',
        //     'NSE:M&MFIN',
        //     'NSE:MACPOWER',
        //     'NSE:MADHAV',
        //     'NSE:MADHUCON',
        //     'NSE:MADRASFERT',
        //     'NSE:MAESGETF',
        //     'NSE:MAFANG',
        //     'NSE:MAFSETF',
        //     'NSE:MAGADSUGAR',
        //     'NSE:MAHABANK',
        //     'NSE:MAHASTEEL',
        //     'NSE:MAHEPC',
        //     'NSE:MAHESHWARI',
        //     'NSE:MAHINDCIE',
        //     'NSE:MAHLIFE',
        //     'NSE:MAHLOG',
        //     'NSE:MAHSCOOTER',
        // ]

        const instruments = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/instruments.txt").toString());
        const intraday = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/IntraDay.txt").toString());
        const sectordata = JSON.parse(fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sectordata.txt").toString());

        // console.log(sectordata);

        kc.getQuote(instruments).then(function (response) {
            // console.log(response);
            const marketdata = new Object();

            for (const key in response) {
                const symbol = key.replace('NSE:', '');
                // console.log(symbol);
                marketdata[symbol] = new Object();
                const name = marketdata[symbol];
                name['instrument_token'] = response[key].instrument_token;
                name['last_traded_price'] = response[key].last_price;
                let netChange;
                if (response[key].net_change == 0) {
                    netChange = Number(((100 * (response[key].last_price - response[key].ohlc.close)) / response[key].ohlc.close).toFixed(2));
                } else {
                    netChange = Number(((response[key].net_change).toFixed(2)));
                }
                name['change'] = netChange;
                name['pre_open_change'] = Number(((100 * (response[key].ohlc.open - response[key].ohlc.close)) / response[key].ohlc.close).toFixed(2));
                name['open'] = response[key].ohlc.open;
                name['high'] = response[key].ohlc.high;
                name['low'] = response[key].ohlc.low;
                name['prev_close'] = response[key].ohlc.close;
                name['average_price'] = response[key].average_price;
                name['lower_circuit_limit'] = response[key].lower_circuit_limit;
                name['distance_from_lcl'] = Number(((100 * (response[key].last_price - response[key].lower_circuit_limit)) / response[key].lower_circuit_limit).toFixed(2));
                name['upper_circuit_limit'] = response[key].upper_circuit_limit;
                name['distance_from_ucl'] = Number(((100 * (response[key].upper_circuit_limit - response[key].last_price)) / response[key].last_price).toFixed(2));
                name['total_buy_quantity'] = response[key].buy_quantity;
                name['total_sell_quantity'] = response[key].sell_quantity;
                name['buy_sell_order_diff'] = response[key].buy_quantity - response[key].sell_quantity;
                name['market_depth_buy'] = response[key].depth.buy;
                name['market_depth_sell'] = response[key].depth.sell;
                for (const item in intraday) {
                    if (item == symbol) {
                        name['margin_multiplier'] = intraday[item];
                    }
                }
                name['distance_from_high'] = Number(((100 * (response[key].ohlc.high - response[key].last_price)) / response[key].last_price).toFixed(2))
                name['distance_from_low'] = Number(((100 * (response[key].last_price - response[key].ohlc.low)) / response[key].ohlc.low).toFixed(2));
                const sectorname = [];
                for (const sector in sectordata) {
                    sectordata[sector].forEach((sym) => {
                        if (sym == symbol) {
                            sectorname.push(sector);
                        }
                    })

                }
                name['sector'] = sectorname;
                name['last_traded_quantity'] = response[key].last_quantity;




            }
            // console.log(marketdata);
            const now = new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', timeStyle: 'medium', hourCycle: 'h24' });
            const time = now.toString();
            console.log(`current data added ${time}`);
            fs.writeFileSync('E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/requiredData.txt', JSON.stringify(marketdata), function (err) {
                if (err) throw err;
                console.log("requiredData.txt created");
            });


        }).catch(function (err) {

        });

    } catch (error) {

    }
}, 1000);