import Ajv from 'ajv';
import * as AdmZip from 'adm-zip';
import { v4 as uuid } from 'uuid';
import { ensureDir } from 'fs-extra';
import * as path from 'path';
import { promisify } from 'util';

const ajv = new Ajv();

export class ExtensionLoaderError extends Error {}

export class ExtensionLoader {
  protected archive: AdmZip;

  public constructor(path: string | Buffer) {
    this.archive = new AdmZip(path);
  }

  verify() {
    try {
      return this.verifyThrow();
    } catch (err) {
      return false;
    }
  }

  verifyThrow() {
    const manifest = this.archive.getEntry('manifest.json');
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['name', 'version'],
    };
    let vaildate = ajv.compile(schema);

    if (manifest === null) {
      throw new ExtensionLoaderError('Manifest not found');
    }
    let json = null;

    try {
      json = JSON.parse(manifest.getData().toString());
    } catch (err) {
      throw new ExtensionLoaderError('Manifest file. JSON not valid');
    }

    const isValid = vaildate(json);
    if (!isValid) {
      throw new ExtensionLoaderError('Properties validate errors');
    }
    return true;
  }

  async extract(outputPath: string): Promise<void> {
    this.verifyThrow();
    const entry = this.archive.getEntry('manifest.json');
    const manifest = JSON.parse(entry.getData().toString());
    const id = uuid();
    const pkgName = `${id}_${manifest.name}`;
    const pkgPath = path.join(outputPath, pkgName);

    await ensureDir(pkgPath);
    return this.archive.extractAllTo(pkgPath, false);
  }
}
