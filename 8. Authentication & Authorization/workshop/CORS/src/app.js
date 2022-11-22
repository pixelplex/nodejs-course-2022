const express = require('express');
const cors = require('cors');

// const AppError = require('./error');

const app = express();

// Body parse middleware
app.use(express.json());
app.use(express.urlencoded());

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

const whitelist = ['http://localhost:8080'];

const corsOptions = {
  origin: whitelist,
  methods: ['PATCH', 'DELETE'],
};

// CORS Middleware
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  console.log('A request reached the GET controller!');
  res.status(200).json({ message: 'GET request is successful' });
});

app.post('/', (req, res) => {
  console.log('A request reached the POST controller!');
  res.status(200).json({ message: 'POST request is successful' });
});

app.patch('/', (req, res) => {
  console.log('A request reached the PATCH controller!');
  res.status(200).json({ message: 'PATCH request is successful' });
});

app.delete('/', (req, res) => {
  console.log('A request reached the DELETE controller!');
  res.status(200).json({ message: 'DELETE request is successful' });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  const { message, data, statusCode = 500 } = error;
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
