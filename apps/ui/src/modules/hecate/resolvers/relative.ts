import type { HecateCompilerImportResolver } from "hecate/composables/createCompiler"
import { importVueFile } from "./vue-sfc"
import { importJavascriptFile } from "./javascript"

export function useRelativeResolvers(filename: string) {
    const resolvers: HecateCompilerImportResolver[] = []

    resolvers.push({
        test: (key) => /\.{1,2}\/[^'"]+\.(js|ts)/.test(key),
        resolve: async (key) => {
            let folder = dirname(filename)

            return importJavascriptFile(resolve(folder, key))
        }
    })


    resolvers.push({
        test: (key) => /\.{1,2}\/[^'"]+\.(vue)/.test(key),
        resolve: async (key) => {
            let folder = dirname(filename)

            return importVueFile(resolve(folder, key))
        }
    })

    return resolvers
}

