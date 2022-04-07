import { Key, pathToRegexp } from 'path-to-regexp';
import { Route } from './route';
import { HandlerFn } from './types';

export class Layer {
  method: string;

  handler: HandlerFn;

  path: string;

  route: Route;

  regex: RegExp;

  keys: Key[] = [];

  constructor(path: string, handler: HandlerFn) {
    this.path = path;
    this.handler = handler;
    if (path) {
      this.regex = pathToRegexp(this.path, this.keys);
    }
  }

  handleRequest(req, res, next) {
    try {
      this.handler(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  match(path: string): boolean {
    let match: RegExpExecArray;

    if (path) {
      match = this.regex.exec(path);
    }

    return !!match;
  }

  getPathParams(path: string): object {
    let match = this.regex.exec(path);

    const params = {};

    if (match) {
      for (let i = 1; i < match.length; i++) {
        const key = this.keys[i - 1];
        const prop = key.name;
        const value = match[i];
        params[prop] = value;
      }
    }
    return params;
  }
}
