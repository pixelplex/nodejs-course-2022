import * as express from 'express';
import { Application } from 'express';

import { PostsController } from './posts.controller';
import { PostValidation } from './posts.validation';
import { isAuth, validatePayload } from '@middleware';

const router = express.Router();

router.get('/all', isAuth, PostsController.getAllPosts);
router.get('/search', isAuth, ...PostValidation.search, validatePayload, PostsController.search);
router.get('/:postId', isAuth, ...PostValidation.getOnePost, validatePayload, PostsController.getOnePost);
router.post('/', isAuth, ...PostValidation.addPost, validatePayload, PostsController.addPost);
router.patch('/:postId', isAuth, ...PostValidation.updatePost, validatePayload, PostsController.updatePost);
router.delete('/:postId', isAuth, ...PostValidation.deletePost, validatePayload, PostsController.deletePost);

export function mountRouter(app: Application): void {
  app.use('/post', router);
}
