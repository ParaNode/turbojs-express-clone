import { Request } from './request';
import { Response } from './response';

export type HandlerFn = (req?: Request, res?: Response, next?: Function) => any;
