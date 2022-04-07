import { Request } from "./../request";
import { Response } from "./../response";

export function Logger(req: Request, res: Response, next) {
  const startTime = process.hrtime();
  const method = req.method;
  const path = req.url;
  res.on('close', () => {
    const finish = process.hrtime(startTime);
    const ms = (finish[0] * 1000000000 + finish[1]) / 1000000
    console.log(`${method} ${path} - ${ms}ms`)
  });
  next();
}