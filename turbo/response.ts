import { IncomingMessage, ServerResponse } from 'http';

export class Response extends ServerResponse {
  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }
  send(data: any) {
    let parsedData = data;
    let contentType = 'text/plain';
    if (typeof data === 'object') {
      parsedData = JSON.stringify(data) || '';
      contentType = 'application/json';
    }
    
    this.writeHead(this.statusCode || 200, {
      'content-type': contentType,
    });
    
    this.write(parsedData || '');
    this.end();
    return this;
  }
}
