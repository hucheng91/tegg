import { Inject, Injectable } from '@artus/core';
import { KoaResponse } from '../thridparty';
import { KOA_RESPONSE } from '../constant';

@Injectable()
export default class Request {
  @Inject(KOA_RESPONSE)
  private res: KoaResponse;

  set status(stats: number) {
    this.res.status = stats;
  }

  get status(): number {
    return this.res.status;
  }
}
