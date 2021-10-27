import AdmZip from "adm-zip";
import util from 'util';

export class ExtensionError extends Error {
}

export function load(path: string) {
    const zip = new AdmZip(path);
    const manifest = zip.getEntry('manifest.json');
    if (!manifest) {
        throw new ExtensionError('Manifest not found');
    }
    const extract = util.promisify(zip.extractAllToAsync);
    return extract('./ext', false);
}
