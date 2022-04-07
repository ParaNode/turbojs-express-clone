import { IncomingMessage } from 'http';

export class Request extends IncomingMessage {
  body: any;
  params: any;
  query: any;
}
