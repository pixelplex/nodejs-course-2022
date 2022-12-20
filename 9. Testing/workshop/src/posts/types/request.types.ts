import { Request } from 'express';
import { AddPostBody, UpdatePostBody } from './body.types';
import { DeletePostParams, GetOnePostParams, UpdatePostParams } from './params.types';
import { SearchPostQuery } from './query.types';

/*
1. Params
2. Response
3. Body
4. Query
*/

export type GetOnePostRequest = Request<GetOnePostParams>;

export type AddPostRequest = Request<unknown, unknown, AddPostBody>;

export type UpdatePostRequest = Request<UpdatePostParams, unknown, UpdatePostBody>;

export type DeletePostRequest = Request<DeletePostParams>;

export type SearchPostRequest = Request<unknown, unknown, unknown, SearchPostQuery>;
