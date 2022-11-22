const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Body parse middleware
app.use(express.json());

app.use(cookieParser());

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

app.get('/', (req, res) => {
  if (req.cookies.secret_cookie !== 'very_secret_thing') {
    res.status(401).send('<p>Visit <a href="/set-cookie">cookie page</a> first</p>');
    return;
  }
  res.status(200).send('Cookie identified successfully!');
});

app.get('/set-cookie', (req, res) => {
  res
    .cookie('secret_cookie', 'very_secret_thing', { maxAge: 5000 })
    .status(200)
    .send('<p>Cookie has been set! Now you can <a href="/">go to main page</a>.</p>');
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
