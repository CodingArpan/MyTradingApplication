const fs = require('fs');
const AUTO = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-AUTO.csv").toString());
const OIL_GAS = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-OIL-&-GAS.csv").toString());
const PHARMA = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-PHARMA.csv").toString());
const REALTY = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-REALTY.csv").toString());
const PRIVATE_BANK = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-PRIVATE-BANK.csv").toString());
const PSU_BANK = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-PSU-BANK.csv").toString());
const IT = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-IT.csv").toString());
const MEDIA = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-MEDIA.csv").toString());
const FINANCIAL_SERVICES = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-FINANCIAL-SERVICES.csv").toString());
const BANK = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-BANK.csv").toString());
const METAL = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-METAL.csv").toString());
const FMCG = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-FMCG.csv").toString());
const ENERGY = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-ENERGY.csv").toString());
const HEALTHCARE_INDEX = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-HEALTHCARE-INDEX.csv").toString());
const CONSUMER_DURABLES = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-CONSUMER-DURABLES.csv").toString());
const INFRASTRUCTURE = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-INFRASTRUCTURE.csv").toString());
const PSE = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-PSE.csv").toString());
const SERVICES_SECTOR = (fs.readFileSync("E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sector_Data/NIFTY-SERVICES-SECTOR.csv").toString());

// console.log(OIL_GAS);
const sectors = [AUTO,OIL_GAS,PHARMA,REALTY,PRIVATE_BANK,PSU_BANK,IT,MEDIA,FINANCIAL_SERVICES,BANK,METAL,FMCG,ENERGY,HEALTHCARE_INDEX,CONSUMER_DURABLES,INFRASTRUCTURE,PSE,SERVICES_SECTOR];

const allSectors = new Object();
sectors.forEach((sector)=>{
    const rows = sector.split('\n').slice(14);
    // console.log(rows[0]);
    const sector_name = rows[0].split(',')[0];
    // console.log(sector_name);
    const list =[];
    allSectors[sector_name.replace('"','').replace('"','')] = list;
    rows.forEach((row)=>{
        const rowData = row.split(',');
        const symbol = rowData[0];
        // console.log(symbol);
        list.push(symbol.replace('"','').replace('"',''));
    })
})
console.log(allSectors);
fs.writeFileSync('E:/STOCK MARKET/MY SOFTWARE/Back-End Programmes/Database/Sectordata.txt', JSON.stringify(allSectors), function (err) {
    if (err) throw err;
    console.log("Sectordata.txt created");
});


// const rows = ENERGY.split('\n').slice(15);
//     console.log(rows);