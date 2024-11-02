import { importJavascriptFile } from "../resolvers/javascript";
import { importVueFile } from "../resolvers/vue-sfc";

export function importModule(filename: string) {
    if (filename.endsWith('.js')) {
        return importJavascriptFile(filename)
    }

    if (filename.endsWith('.vue')) {
        return importVueFile(filename)
    }

    throw new Error(`Unsupported file type: ${filename}`)
}
