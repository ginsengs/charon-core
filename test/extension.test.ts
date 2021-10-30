import { Extension } from '../lib/extension';
import * as path from 'path';

describe('Extension', () => {
  const manifest = path.resolve('./test/__mock__/extension/manifest.json');

  test('Scan', async () => {
    const extension = await Extension.scan(manifest);

    console.log(extension);
  });
});