import { Manifest } from './manifest';
import { readJSON } from 'fs-extra';

export class Extension {
  private constructor(readonly manifest: Manifest) {
  }

  public runServices() {
    // for (let service of this.manifest.services) {
    //   service.script;
    // }
  }

  static async scan(manifestPath: string) {
    return readJSON(manifestPath).then((manifest: Manifest) => {
      return new this(manifest);
    });
  }
}
