const express = require('express');

const app = express();

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
