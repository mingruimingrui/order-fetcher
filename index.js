require('daemon')();
const fetchUrl = require('fetch').fetchUrl;
const jsonfile = require('jsonfile');
const exec = require('promised-exec');
const mkdirp = require('mkdirp');

const order_url = [
  'https://api.gdax.com/products/BTC-USD/book?level=2',
  'https://api.gdax.com/products/LTC-USD/book?level=2',
  'https://api.gdax.com/products/ETH-USD/book?level=2'
];

const file_name = ['BTC', 'LTC', 'ETH'];

function myFun(ext, i) {

  try{
    fetchUrl(order_url[i], (err, res, data) => {
      const JSON_object = JSON.parse(data.toString());
      const file = 'data/' + ext + '-' + file_name[i] + '.json';
      jsonfile.writeFile(file, JSON_object);
    });
    console.log('success');
  } catch(e) {
    console.log(e);
  }

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
mkdirp('data/' + ext + 'BTC/')
mkdirp('data/' + ext + 'LTC/')
mkdirp('data/' + ext + 'ETH/')

for (let i=0; i<3; i++) {
  myFun(file_name[i] + '/' + ext + cur_time, i);
}

setInterval(() => {
  cur_time = Date.now();
  cur_time = cur_time - cur_time % 1000;
  today = new Date(cur_time);
  // today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
  if (today.getUTCDate() != cur_date) {
    ext = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '/';
    mkdirp('data/' + ext + 'BTC/')
    mkdirp('data/' + ext + 'LTC/')
    mkdirp('data/' + ext + 'ETH/')
  }

  for (let i=0; i<3; i++) {
    myFun(ext + file_name[i] + '/' + cur_time, i);
  }
}, 3000)

