
import * as express from 'express';
import mongoose from 'mongoose';

import { mountRouter as mountPostsRouter } from './posts/posts.router';
import { mountRouter as mountAuthRouter } from './auth/auth.router';
import { logRequest, processError, processNotFoundEndpoint } from '@middleware';

const app = express();

app.use(express.json());

app.use(logRequest);

mountAuthRouter(app);
mountPostsRouter(app);

app.use(processNotFoundEndpoint);
app.use(processError);
function connectDb() {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/mydb');
  return mongoose.connection;
}

function startServer() {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDb()
  .on('error', console.log)
  .on('disconnected', connectDb)
  .once('open', startServer);
