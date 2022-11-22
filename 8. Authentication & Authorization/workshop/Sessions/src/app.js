const express = require('express');
const session = require('express-session');

const app = express();

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

// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 10000 } }));

app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views += 1;
    res.setHeader('Content-Type', 'text/html');
    res.write(`
    <p>Views: ${req.session.views}</p>
    `);
    res.write(`
      <p>Your session will expire after: ${Math.round(req.session.cookie.maxAge / 1000)} seconds of inactivity, at: ${
      req.session.cookie.expires
    }</p>
    `);
    res.end();
  } else {
    req.session.views = 1;
    res.end('Welcome to the session demo. Refresh!');
  }
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
