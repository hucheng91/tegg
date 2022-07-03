import { IncomingHttpHeaders } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { Inject, Injectable } from '@artus/core';
import { KoaRequest } from '../thridparty';
import { KOA_REQUEST } from '../constant';

@Injectable()
export default class Request {
  @Inject(KOA_REQUEST)
  private req: KoaRequest;

  get header(): IncomingHttpHeaders {
    return this.req.header;
  }

  get headers(): IncomingHttpHeaders {
    return this.req.headers;
  }

  get url(): string {
    return this.req.url;
  }

  get origin(): string {
    return this.req.origin;
  }

  get href(): string {
    return this.req.href;
  }

  get method(): string {
    return this.req.method;
  }

  get path(): string {
    return this.req.path;
  }

  get query(): ParsedUrlQuery {
    return this.req.query;
  }

  get ip(): string {
    return this.req.ip;
  }

  get originalUrl(): string {
    return this.req.originalUrl;
  }
}
