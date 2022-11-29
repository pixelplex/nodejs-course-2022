const express = require('express');
const { EventEmitter } = require('events');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());
const eventEmitter = new EventEmitter();
const visitors = [];
// Body parse middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`\nNew incoming request:\n`);
  console.log(`\t${req.method} ${req.url} HTTP/${req.httpVersion}\n`);
  for (const [header, value] of Object.entries(req.headers)) {
    console.log(`\t${header}: ${value}`);
  }
  console.dir(req.body);
  next();
});

app.get('/home', function (req, res, next) {
  visitors.push(req.query.name);
  eventEmitter.emit('new-user');
  res.send('Welcome!');
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  const { message, data, statusCode } = error;
  if (!statusCode || statusCode >= 500) {
    console.error(error);
  }
  res.status(statusCode || 500).json({ message, data });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (client) => {
  client.on('message', (m) => {
    const parsedMessage = JSON.parse(m);
    switch (parsedMessage.event) {
      case 'hello':
        client.send(JSON.stringify({ event: 'hello' }));
        break;
      default:
        client.send(new Error('Wrong query').message);
    }
  });
  client.on('error', (e) => client.send(e));
});

eventEmitter.on('new-user', () => {
  io.sockets.sockets.forEach((client) =>
    client.send(JSON.stringify({ event: 'visitors', payload: visitors.join(', ') }))
  );
});
server.listen(8080, () => console.log('Server started'));
