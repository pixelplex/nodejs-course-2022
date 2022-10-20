const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

const URL = 'https://jsonplaceholder.typicode.com/users';

function resultHandler(err) {
  if (err === null) {
    console.log('Everything is fine');
    return;
  }
  console.error(err);
}

const request = https.get(URL, (res) => {
  // 1-ый уровень вложенности
  const data = [];

  res.on('data', (chunk) => {
    data.push(chunk);
  });

  res.on('end', () => {
    // 2-ой уровень вложенности
    const readableData = Buffer.concat(data).toString();

    crypto.pbkdf2('secret', 'salt', 1000, 16, 'sha512', (err, bytes) => {
      // 3-ий уровень вложенности
      if (err) {
        resultHandler(err);
        return;
      }

      const hash = bytes.toString('hex');
      const filename = path.join('data', `users_${hash}.json`);

      fs.writeFile(filename, readableData, { encoding: 'utf-8' }, (error) => {
        // 4-ый уровень вложенности - и это не предел
        if (error) {
          resultHandler(error);
          return;
        }
        resultHandler(null);
      });
    });
  });
});

request.on('error', console.error);
