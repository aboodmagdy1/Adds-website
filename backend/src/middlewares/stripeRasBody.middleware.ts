import { Request, Response, NextFunction } from 'express';
import * as RawBody from 'raw-body';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

export function rawBodyMiddleware(
  req: RequestWithRawBody,
  res: Response,
  next: NextFunction,
) {
  if (req.originalUrl === '/api/stripe/webhook') {
    RawBody(req as any, {
      encoding: true,
      length: req.headers['content-length'],
    })
      .then((buffer) => {
        req.rawBody = Buffer.from(buffer);
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
}
