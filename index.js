console.log('process running on port', process.pid);
require('daemon')();
const ccxt = require ('ccxt');
const jsonfile = require('jsonfile');
const exec = require('promised-exec');
const fs = require('fs');

fs.writeFile('logs/PORT.sh', process.pid, err => err);

const exchanges = [
  'poloniex',  // US
  'bittrex',   // US
  'huobipro',  // CN
  'binance',   // JP
  'hitbtc'     // UK
].map(x => new ccxt[x]());

const pairs = [
  'BTC/USDT',  // USD as a basis for value
  'XRP/BTC',   // the crypoto made for banks
  'DASH/BTC'   // fastest crypto for transaciton
];

const pairs_disp_name = pairs.map(pair =>
  pair.replace(/BTC/g,'').replace('/','')
);

const INTERVAL = 10000;
const ERROR_FILE = 'logs/error.txt';

setInterval(() => {
  let curDate = new Date()
  let timestamp = curDate.getTime();
  timestamp = Math.floor(timestamp / INTERVAL) * INTERVAL;

  let formattedDateString = curDate.toISOString().slice(0,10);
  createFoldersIfMissing('data/' + formattedDateString);

  exchanges.forEach(ex => {
    pairs.forEach((pair, i) => {
      let folder_name = 'data/' + formattedDateString + '/' + pairs_disp_name[i] + '/';
      let file_name = folder_name + timestamp + '-' + pairs_disp_name[i] + '-' + ex.id + '.json';
      fetchOrderSaveValue(ex, pair, file_name, timestamp);
    });
  });

}, INTERVAL);

const fetchOrderSaveValue = (ex, pair, file_name, timestamp) => {
  ex.fetchOrderBook(pair)
  .then(data => {
    let dataToSave = {
      pair, timestamp,
      bids: data.bids.slice(0,50),
      asks: data.asks.slice(0,50)
    }

    jsonfile.writeFile(file_name, dataToSave);
  })
  .catch(err => {
    let msg = 'Failed to fetch ' + file_name + '\n';
    fs.appendFile(ERROR_FILE, msg, err => err);
  });

};

const createFoldersIfMissing = (root_folder_name) => {
  // only create if files don't exist
  if (fs.existsSync(root_folder_name)) return;

  // create root folder
  fs.mkdirSync(root_folder_name);

  // create folder for each pair
  pairs_disp_name.forEach(pair => {
    fs.mkdirSync(root_folder_name + '/' + pair);
  });

};




// exchanges[0].fetchL2OrderBook('XRP/BTC')
// .then()
