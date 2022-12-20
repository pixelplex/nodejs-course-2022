import { Request, Response } from 'express';

export const processNotFoundEndpoint = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'API endpoint not found', statusCode: 404 });
};
