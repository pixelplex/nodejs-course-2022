const fs = require('fs/promises');
const crypto = require('crypto');
const path = require('path');
const util = require('util');

const URL = 'https://jsonplaceholder.typicode.com/users';

const pbkdf2 = util.promisify(crypto.pbkdf2);
const fail = true; // TASK: Попробуйте изменять переменную и понаблюдать, что получится.

async function callAndReturnData() {
  const res = await fetch(URL);
  if (fail) {
    throw new Error('An error occured'); // Example of how a promise can be rejected
  }
  const data = await res.json();
  return data;
}

async function main() {
  try {
    const data = await callAndReturnData();
    const bytes = await pbkdf2('secret', 'salt', 1000, 16, 'sha512');
    const hash = bytes.toString('hex');
    const filename = path.join('data', `users_${hash}.json`);
    await fs.writeFile(filename, JSON.stringify(data), { encoding: 'utf-8' });
    console.log('Everything is fine');
  } catch (error) {
    console.log('We got to "catch"');
    console.error(error);
  }
}

main();
