import Ajv from 'ajv';
import * as AdmZip from 'adm-zip';
import { v4 as uuid } from 'uuid';
import { ensureDir } from 'fs-extra';
import * as path from 'path';

const ajv = new Ajv();

export class ExtensionUnpackError extends Error {}

export class ExtensionUnpack {
  protected archive: AdmZip;

  public constructor(extPath: string | Buffer) {
    this.archive = new AdmZip(extPath);
  }

  /**
   * @description Checks for a valid manifest.
   **/
  verify(): boolean {
    try {
      return this.verifyThrow();
    } catch (err) {
      return false;
    }
  }

  /**
   * @description Checks for a valid manifest. Throws exceptions.
   * @throws ExtensionUnpackError
   **/
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
    let validate = ajv.compile(schema);
    let json = null;
    if (manifest === null) {
      throw new ExtensionUnpackError('Manifest not found');
    }
    try {
      json = JSON.parse(manifest.getData().toString());
    } catch (err) {
      throw new ExtensionUnpackError('Manifest file. JSON not valid');
    }

    const isValid = validate(json);
    if (!isValid) {
      throw new ExtensionUnpackError('Properties validate errors');
    }
    return true;
  }

  /**
   * @description Unpin the extension to the catalog
   **/
  async extract(outputPath: string): Promise<string> {
    this.verifyThrow();
    const entry = this.archive.getEntry('manifest.json');
    const rawManifest = JSON.parse(entry.getData().toString());
    const id = uuid();
    const pkgName = `${id}_${rawManifest.name}`;
    const pkgPath = path.join(outputPath, pkgName);

    await ensureDir(pkgPath);
    this.archive.extractAllTo(pkgPath, false);
    return path.join(pkgPath, pkgName);
  }
}
