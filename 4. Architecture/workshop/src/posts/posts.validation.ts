import { body, query, param } from 'express-validator';

export class PostValidation {
  static search = [query('phrase').isString().trim().isLength({ min: 1 }).toLowerCase()];

  static getOnePost = [param('postId').isInt({ allow_leading_zeroes: false }).toInt()];

  static addPost = [
    body('title').isString().trim().isAlphanumeric('en-US', { ignore: ' ' }).isLength({ min: 5 }),
    body('content').isString().trim().isLength({ min: 1 }),
    body('imageUrl').isURL(),
    body('userId').isInt({ allow_leading_zeroes: false }).toInt(),
  ];

  static updatePost = [
    body('title').optional().isString().trim().isAlphanumeric('en-US', { ignore: ' ' }).isLength({ min: 5 }),
    body('content').optional().isString().trim().isLength({ min: 1 }),
    body('imageUrl').optional().isURL(),
    body('id').isEmpty().withMessage("You can't rebind id"),
    body('creator').isEmpty().withMessage("You can't rebind author id"),
    param('postId').isInt({ allow_leading_zeroes: false }).toInt(),
  ];

  static deletePost = [param('postId').isInt({ allow_leading_zeroes: false }).toInt()];
}
