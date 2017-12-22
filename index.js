require('daemon')();
const fetchUrl = require('fetch').fetchUrl;
const jsonfile = require('jsonfile');
const exec = require('promised-exec');
const mkdirp = require('mkdirp');
const fs = require('fs');

const order_url = [
  'https://api.gdax.com/products/BTC-USD/book?level=2',
  'https://api.gdax.com/products/LTC-USD/book?level=2',
  'https://api.gdax.com/products/ETH-USD/book?level=2'
];

const log_file = 'logs/log.txt'
const file_name = ['BTC', 'LTC', 'ETH'];

function myFun(ext, i) {
  fetchUrl(order_url[i], (err, res, data) => {
    if (err) {
      fs.appendFile(log_file, 'failed to save at ' + ext + '\n');
    } else {
      const JSON_object  = JSON.parse(data.toString());
      const file = 'data/' + ext + '-' + file_name[i] + '.json';
      jsonfile.writeFile(file, JSON_object);
    }

    // try {
    //   const JSON_object = JSON.parse(data.toString());
    //   const file = 'data/' + ext + '-' + file_name[i] + '.json';
    //   jsonfile.writeFile(file, JSON_object);
    // } catch(e) {
    //   fs.appendFile(log_file, 'failed to save at ' + ext + '\n');
    // }

    // const JSON_object = JSON.parse('<dovtype HTML>');
    // const JSON_object = JSON.parse(data.toString());
    // const file = 'data/' + ext + '-' + file_name[i] + '.json';
    // jsonfile.writeFile(file, JSON_object);
  });

  // exec('gsutil cp ' + file + ' gs://mingrui-bucket/bitcoin-book/' + file).then((res) => {
  //   console.log(res)
  //   exec('rm ' + file)
  // })
  // exec('gsutil cp ' + file + ' gs://mingrui-bucket/bitcoin-book/' + file)
  // exec('rm ' + file)

}

let cur_time = Date.now();
cur_time = cur_time - cur_time % 1000;
let today = new Date(cur_time);
let cur_date = today.getUTCDate();
let ext = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '/';
mkdirp('data/' + ext + 'BTC/');
mkdirp('data/' + ext + 'LTC/');
mkdirp('data/' + ext + 'ETH/');

for (let i=0; i<3; i++) {
  myFun(file_name[i] + '/' + ext + cur_time, i);
}

setInterval(() => {
  cur_time = Date.now();
  cur_time = cur_time - cur_time % 1000;
  today = new Date(cur_time);
  if (today.getUTCDate() != cur_date) {
    cur_date = today.getUTCDate();
    
    ext = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '/';
    mkdirp('data/' + ext + 'BTC/');
    mkdirp('data/' + ext + 'LTC/');
    mkdirp('data/' + ext + 'ETH/');
  }

  for (let i=0; i<3; i++) {
    myFun(ext + file_name[i] + '/' + cur_time, i);
  }
}, 3000)
