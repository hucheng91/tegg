import path from 'path';
import { Scanner } from '@artus/core';

const appBaseDir = path.join(__dirname, 'apps');
type CreateAppOptions = {
  debug?: boolean;
  env?: string;
};

export async function createApp(root, { debug, env }: CreateAppOptions) {
  const baseDir = path.join(appBaseDir, root);
  const scanner = new Scanner({ needWriteFile: false });
  const manifest = await scanner.scan(baseDir);

  debug ??= false;
  env ??= 'default';

  if (debug) {
    console.log('manifest:', manifest);
  }

  return manifest[env];
}