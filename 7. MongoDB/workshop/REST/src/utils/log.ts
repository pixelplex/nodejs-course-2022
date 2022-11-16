export function logging(req, res, next) {
  console.log('\nNew incoming request:\n');
  console.log(`\t${req.method} ${req.url} HTTP/${req.httpVersion}\n`);
  for (const [header, value] of Object.entries(req.headers)) {
    console.log(`\t${header}: ${value}`);
  }
  console.dir(req.body);
  next();
};
