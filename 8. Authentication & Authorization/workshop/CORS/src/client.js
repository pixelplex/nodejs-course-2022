const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`
  <p>Press the buttons below to make requests on <i>http://localhost:8080</i></p>
  <button onclick="makeGETRequest();">
    GET!
  </button>
  <button onclick="makePOSTRequest();">
    POST!
  </button>
  <button onclick="makePATCHRequest();">
    PATCH!
  </button>
  <button onclick="makeDELETERequest();">
    DELETE!
  </button>
  <script>
    async function makeGETRequest() {
      await fetch('http://localhost:8080').then(res => res.json()).then(console.log).catch(console.error);
    }
    async function makePOSTRequest() {
      await fetch('http://localhost:8080', { method: 'POST' }).then(res => res.json()).then(console.log).catch(console.error);
    }
    async function makePATCHRequest() {
      await fetch('http://localhost:8080', { method: 'PATCH' }).then(res => res.json()).then(console.log).catch(console.error);
    }
    async function makeDELETERequest() {
      await fetch('http://localhost:8080', { method: 'DELETE' }).then(res => res.json()).then(console.log).catch(console.error);
    }
  </script>
  `);
  res.end();
});

app.get('/form', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <p>The form below will send POST request to  <i>http://localhost:8080</i></p>
    <form action="http://localhost:8080" method="POST">
      <input type="text" name="username">
      <input type="password" name="password">
      <button type="submit">Send</button>
    </form>
  `);
  res.end();
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
    app.listen(8081, () => console.log('Listening 8081'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
