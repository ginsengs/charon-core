import { ExtensionLoader, ExtensionLoaderError } from '../lib/extension-loader';
import * as AdmZip from 'adm-zip';

const makeExtension = (manifest?: any) => {
  const zip = new AdmZip();
  zip.addLocalFolder('./test/__mock__/extension');

  manifest && zip.updateFile('manifest.json', Buffer.from(manifest));
  return zip;
};

describe('Extension loader', () => {
  test('Verify extensions zip package', () => {
    const buf = makeExtension().toBuffer();
    const loader = new ExtensionLoader(buf);
    expect(loader.verifyThrow()).toBe(true);
  });

  test('Manifest verify properties error', () => {
    const loader = new ExtensionLoader(
      makeExtension(
        JSON.stringify({
          version: 1,
        })
      ).toBuffer()
    );

    expect(() => loader.verifyThrow()).toThrowError(
      new ExtensionLoaderError('Properties validate errors')
    );
  });

  test('Extension output', async () => {
    const zip = makeExtension();
    const loader = new ExtensionLoader(zip.toBuffer());
    await loader.extract('./output');
  }, 25000);
});
