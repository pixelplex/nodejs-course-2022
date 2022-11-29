const express = require('express');
const { EventEmitter } = require('events');
const cors = require('cors');

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

app.get('/data', function (req, res, next) {
  const time = new Date().getTime();
  let seconds = Math.random() * 10000;

  if (seconds < 1000) {
    return res.json({ hasValue: false, value: null });
  }

  if (seconds > 8000) {
    seconds = 60000;
  }

  console.log('waiting seconds before responding', seconds);

  return setTimeout(() => res.json({ hasValue: true, value: time }), seconds);
});

app.get('/home', function (req, res, next) {
  visitors.push(req.query.name);
  eventEmitter.emit('new-user');
  res.send('Welcome!');
});

app.get('/users', function (req, res, next) {
  eventEmitter.once('new-user', function () {
    res.json({ visitors });
  });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  const { message, data, statusCode } = error;
  if (!statusCode || statusCode >= 500) {
    console.error(error);
  }
  res.status(statusCode || 500).json({ message, data });
});

async function init() {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
