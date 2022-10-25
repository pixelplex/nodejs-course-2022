const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    mainGET(req, res);
    return;
  }

  if (url === '/form' && method === 'GET') {
    formGET(req, res);
    return;
  }

  if (url === '/form' && method === 'POST') {
    formPOST(req, res);
    return;
  }

  sendError(res, 'Resource not found!', 404);
});

function mainGET(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.write(
    `<html>
      <head><title>My First Page</title></head>
      <body>
        <h1>Hello from my Node.js Server!</h1>
        <p><a href="/form">Go to form</a></p>
      </body>
    </html>`
  );
  res.end();
}

function formGET(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <html>
      <head><title>Enter Message</title></head>
      <body>
        <form action="/form" method="POST">
          <input type="text" name="message">
          <button type="submit">Send</button>
        </form>
      </body>
    </html>`);
  res.end();
}

function formPOST(req, res) {
  const body = [];

  req.on('data', (chunk) => body.push(chunk));

  req.on('end', () => {
    const parsedBody = Buffer.concat(body).toString();
    const message = parsedBody.split('=')[1];
    const filename = path.join('data', `message__${new Date().toISOString()}.txt`);

    if (!message) {
      redirect(res, '/form');
      return;
    }

    fs.writeFile(filename, message, (err) => {
      if (err) {
        sendError(res, err.message, err.code);
        return;
      }
      redirect(res, '/');
    });
  });
}

function sendError(res, message = 'An unexpected error occured', statusCode = 500) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <html>
      <head><title>Error</title></head>
      <body><h1>${message}</h1></body>
    </html>`);
  res.end();
}

function redirect(res, to) {
  res.statusCode = 302;
  res.setHeader('Location', to);
  res.end();
}

server.listen(3000);
