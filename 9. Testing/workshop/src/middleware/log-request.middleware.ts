import { NextFunction, Request, Response } from 'express';

export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`\nNew incoming request:\n`);
  console.log(`\t${req.method} ${req.url} HTTP/${req.httpVersion}\n`);
  for (const [header, value] of Object.entries(req.headers)) {
    console.log(`\t${header}: ${value}`);
  }
  console.dir(req.body);
  next();
};
