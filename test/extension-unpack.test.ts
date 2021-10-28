import { ExtensionUnpack, ExtensionUnpackError } from '../lib/extension-unpack';
import * as AdmZip from 'adm-zip';
import { pathExists, remove } from 'fs-extra';

const makeExtension = (manifest?: any) => {
  const zip = new AdmZip();
  zip.addLocalFolder('./test/__mock__/extension');
  manifest && zip.updateFile('manifest.json', Buffer.from(manifest));
  return zip;
};

describe('Extension loader', () => {
  test('Verify extensions zip package', () => {
    const buf = makeExtension().toBuffer();
    const loader = new ExtensionUnpack(buf);
    expect(loader.verify()).toBe(true);
  });

  test('Manifest verify properties error', () => {
    const loader = new ExtensionUnpack(makeExtension(JSON.stringify({ version: 1 })).toBuffer()
    );
    expect(() => loader.verifyThrow()).toThrowError(
      new ExtensionUnpackError('Properties validate errors')
    );
  });

  test('Extension output', async () => {
    const zip = makeExtension();
    const loader = new ExtensionUnpack(zip.toBuffer());
    await loader.extract('./test/output');
    let has = await pathExists('./test/output');
    expect(has).toBe(true);
    await remove('./test/output');
    has = await pathExists('./test/output');
    expect(has).toBe(false);
  }, 125000);
});
