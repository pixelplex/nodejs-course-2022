const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

const URL = 'https://jsonplaceholder.typicode.com/users';

https.get(URL, responseHandler).on('error', resultHandler);

function resultHandler(err) {
  if (err === null) {
    console.log('Everything is fine');
    return;
  }
  console.error(err);
}

function responseHandler(res) {
  const data = [];

  res.on('data', (chunk) => {
    data.push(chunk);
  });

  res.on('end', () => processData(data, resultHandler));
}

function processData(data) {
  const readableData = Buffer.concat(data).toString();

  crypto.pbkdf2('secret', 'salt', 1000, 16, 'sha512', (err, bytes) => {
    if (err) {
      resultHandler(err);
      return;
    }
    writeToFile(readableData, bytes.toString('hex'));
  });
}

function writeToFile(data, hash) {
  const filename = path.join('data', `users_${hash}.json`);
  fs.writeFile(filename, data, { encoding: 'utf-8' }, (err) => {
    if (err) {
      resultHandler(err);
      return;
    }
    resultHandler(null);
  });
}
