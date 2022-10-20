const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(`Async request is finished in: ${Date.now() - start}`);
      });
    })
    .end();
}

function calculateHash(order) {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`${order} hash is calculated in ${Date.now() - start}`);
  });
}

function readFile() {
  fs.readFile('stc/multitask.js', 'utf8', () => {
    console.log('File is read in:', Date.now() - start);
  });
}

doRequest();

console.log('Making a request!');

readFile();

console.log('Reading file!');

calculateHash(1);
calculateHash(2);
calculateHash(3);
calculateHash(4);
calculateHash(5);
calculateHash(6);
calculateHash(7);
calculateHash(8);

console.log('Calculating hashes!\n');
