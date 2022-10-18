import http from 'http';
import url from 'url';

const server = http.createServer();

server.on('request', (req, res) => {
  const urlParsed = url.parse(req.url, true);
  // debugger;

  if (req.method === 'GET' && urlParsed.pathname === '/hello' && urlParsed.query.name) {
    res.end(`Hello, ${urlParsed.query.name}`);
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(8080);
console.log('Server is running');
