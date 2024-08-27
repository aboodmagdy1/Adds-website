import { Request, Response, NextFunction } from 'express';
import * as RawBody from 'raw-body';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

export function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.originalUrl === '/api/stripe/webhook') {
    RawBody(req as RequestWithRawBody, {
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
