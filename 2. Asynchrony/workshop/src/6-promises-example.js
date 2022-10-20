const fs = require('fs/promises');
const crypto = require('crypto');
const path = require('path');

const URL = 'https://jsonplaceholder.typicode.com/users';

const fail = true; // TASK: Попробуйте изменять переменную и понаблюдать, что получится.

function pbkdf2(password, salt, iterations, keylen, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
      if (err) return reject(err);
      return resolve(key);
    });
  });
}

fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if (fail) throw new Error('An error occured'); // Example of how a promise can be rejected
    return pbkdf2('secret', 'salt', 1000, 16, 'sha512').then((bytes) => {
      const hash = bytes.toString('hex');
      const filename = path.join('data', `users_${hash}.json`);
      return fs.writeFile(filename, JSON.stringify(data), { encoding: 'utf-8' });
    });
  })
  .then(() => console.log('Everything is fine'))
  .catch(console.error);
