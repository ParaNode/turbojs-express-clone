import { Layer } from './layer';
import { Request } from './request';
import { Response } from './response';
import { HandlerFn } from './types';

export class Route {
  layersStack: Array<Layer> = [];
  methods: Record<string, boolean> = {};

  dispatch(req: Request, res: Response, done?: Function) {
    let index = 0;

    if (this.layersStack.length === 0) {
      return done();
    }

    const method = req.method.toLowerCase();

    const next = (err?) => {
      if (err) {
        return done();
      }

      if (index >= this.layersStack.length) {
        return done();
      }

      const layer = this.layersStack[index++];

      if (layer.method !== method) return next();

      layer.handleRequest(req, res, next);
    };

    next();
  }

  constructor(public path: string) {}

  doesItHandleMethod(method: string) {
    if (this.methods.all) {
      return true;
    }

    return Boolean(this.methods[method.toLowerCase()]);
  }

  addMethodHandler(method: string, handler: HandlerFn) {
    const layer = new Layer(this.path, handler);
    layer.method = method;
    layer.route = this;
    this.methods[method.toLowerCase()] = true;

    this.layersStack.push(layer);
  }

  get(...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this.addMethodHandler('get', handler);
    }
  }

  post(...handlers: Array<HandlerFn>) {
    for (const handler of handlers) {
      this.addMethodHandler('post', handler);
    }
  }
}
