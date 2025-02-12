import { Controller } from 'egg';

export default class App extends Controller {
  async baseDir() {
    const baseDir = await this.ctx.module.config.configService.getBaseDir();
    this.ctx.body = {
      baseDir,
    };
  }
}
