import { IncomingMessage, ServerResponse } from 'http';
import { Request } from './request';
import { Response } from './response';
import { Router } from './router';
import { HandlerFn } from './types';
import { createServer } from 'http';

export class TurboApplication {
  _router = new Router();

  handle(req: IncomingMessage, res: ServerResponse) {
    Object.setPrototypeOf(req, Request.prototype);
    Object.setPrototypeOf(res, Response.prototype);

    const finalHandler = () => {
      if (res.headersSent) return;

      (res as Response).status(404).send({ error: 'route not found' });
    };

    this._router.handle(req as Request, res as Response, finalHandler);
  }

  listen(port: number, cb: () => void) {
    const self = this;
    const server = createServer((req, res) => {
      self.handle(req, res);
    });

    server.listen(port, cb);
  }

  use(...handlers: Array<HandlerFn>) {
    this._router.use(...handlers);
  }

  get(path: string, ...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this._router.route(path).addMethodHandler('get', handler);
    }
  }
  post(path: string, ...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this._router.route(path).addMethodHandler('post', handler);
    }
  }
  patch(path: string, ...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this._router.route(path).addMethodHandler('patch', handler);
    }
  }
  put(path: string, ...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this._router.route(path).addMethodHandler('put', handler);
    }
  }
  delete(path: string, ...handlers: Array<HandlerFn>) {
    const route = this._router.route(path);
    for (const handler of handlers) {
      route.addMethodHandler('delete', handler);
    }
  }
  all(path: string, ...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this._router.route(path).addMethodHandler('all', handler);
    }
  }
}
