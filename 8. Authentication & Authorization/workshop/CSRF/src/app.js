const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// Body parse middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

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
  methods: ['GET', 'POST', 'DELETE'],
};

// CORS Middleware
app.use(cors(corsOptions));

app.get('/form', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <p>The form below will send POST request to  <i>http://localhost:8080</i></p>
    <form action="http://localhost:8080" method="POST">
      <input type="text" name="username">
      <input type="password" name="password">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <button type="submit">Send</button>
    </form>
  `);
  res.end();
});

app.post('/', (req, res) => {
  console.log('A request reached the POST controller!');
  res.status(200).json({ message: 'POST request is successful' });
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
