import { Layer } from './layer';
import { Request } from './request';
import { Response } from './response';
import { Route } from './route';
import { HandlerFn } from './types';

export class Router {
  layersStack: Array<Layer> = [];

  use(...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      const layer = new Layer(null, handler);
      this.layersStack.push(layer);
    }
  }

  route(path: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, route.dispatch);
    layer.route = route;

    this.layersStack.push(layer);

    return route;
  }

  handle(req: Request, res: Response, done?: Function) {
    let index = 0;

    if (this.layersStack.length === 0) {
      return done();
    }

    const method = req.method.toLowerCase();

    const url = new URL(req.url, `http://${req.headers.host}`);
    const requestPathName = url.pathname;

    const internalLayersStack: Array<Layer> = [];

    for (const layer of this.layersStack) {
      // add non route layers to be processed directly
      if (!layer.route) {
        internalLayersStack.push(layer);
        continue;
      }

      const match = layer.match(requestPathName);

      if (match) {
        internalLayersStack.push(layer);
      } else {
        continue;
      }

      const reqParams = layer.getPathParams(requestPathName);
      req.params = {
        ...req.params,
        ...reqParams,
      };
    }

    const next = (err?) => {
      if (err) {
        return done();
      }

      if (index >= internalLayersStack.length) {
        return done();
      }

      const layer = internalLayersStack[index++];

      if (layer.route) {
        if (!layer.route.doesItHandleMethod(method)) return next();

        // if (layer.method !== method) return next();

        layer.route.dispatch(req, res, next);
      } else {
        layer.handleRequest(req, res, next);
      }
    };

    next();
  }
}
