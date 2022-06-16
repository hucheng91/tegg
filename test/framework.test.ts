import 'reflect-metadata';
import { createApp } from './fixtures/utils';

describe('test/framework.test.ts', function() {
  describe('simple app', () => {
    it('should start success with tegg', async function() {
      const app = await createApp('simple', { debug: true });
      console.log(app);
    });
  });
});
