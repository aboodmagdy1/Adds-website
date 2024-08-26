// src/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    // This will ensure that the basic Express types are available globally
    export type Request = express.Request;
    export type Response = express.Response;
    export type NextFunction = express.NextFunction;
    export type Application = express.Application;
    export type Router = express.Router;
    export type RequestHandler = express.RequestHandler;
    export type ErrorRequestHandler = express.ErrorRequestHandler;

    namespace Multer {
      export type File = express.Multer.File;
    }
  }
}
