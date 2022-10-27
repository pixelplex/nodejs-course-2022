import * as express from 'express';

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

async function init(): Promise<void> {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
