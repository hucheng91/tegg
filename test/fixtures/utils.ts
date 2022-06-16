import path from 'path';
import { Scanner, ArtusApplication } from '@artus/core';

const appBaseDir = path.join(__dirname, 'apps');
type CreateAppOptions = {
  debug?: boolean;
  env?: string;
};

export async function createApp(root, { debug, env }: CreateAppOptions) {
  const baseDir = path.join(appBaseDir, root);
  const scanner = new Scanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: [ '.ts' ],
  });
  const manifest = await scanner.scan(baseDir);

  debug ??= false;
  env ??= 'default';

  if (debug) {
    console.log('manifest:', manifest[env]);
  }

  const app = new ArtusApplication();
  await app.load(manifest[env], baseDir);
  await app.run();

  return app;
}
