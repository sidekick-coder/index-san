import type {  HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { defineImportResolver } from "hecate/composables/defineImportResolver";

export interface Options {
    
}

export function createCommonImportResolvers(options?: Options) {

    const resolvers = [] as HecateCompilerImportResolver[]

    
    resolvers.push(
        defineImportResolver({
            test: (path: string) => path === 'vue',
            resolve: async () => import('vue')
        })
    )

    return resolvers
}