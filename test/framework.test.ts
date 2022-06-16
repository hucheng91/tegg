import { createApp } from './fixtures/utils';

describe('test/framework.test.ts', function () {
  describe('simple app', () => {
    it('should start success with tegg', async function () {
      await createApp('simple', { debug: true });
    });
  });
});
