import { SingletonProto } from '@eggjs/tegg';

@SingletonProto()
export class CountService {
  count = 0;
}
