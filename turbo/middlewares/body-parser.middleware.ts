import { Request } from "./../request";
import { Response } from "./../response";

export function BodyParser(req: Request, res: Response, next) {
  if(req.headers['content-type'] === 'application/json') {
    req.on('data', (chunk: Buffer) => {
      const jsonString = chunk.toString();
      const body = JSON.parse(jsonString);
      req.body = body;
      next();
    })
  } else {
    next();
  }
}