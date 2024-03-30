import type {  HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { defineImportResolver } from "hecate/composables/defineImportResolver";
import { useDrive } from "@/composables/useDrive";

export interface Options {
    
}

export function createCommonImportResolvers(options?: Options) {

    const resolvers = [] as HecateCompilerImportResolver[]

    
    resolvers.push(
        defineImportResolver({
            test: (path: string) => path === 'vue',
            resolve: async () => import('vue')
        }),
        defineImportResolver({
            test: (path: string) => path === 'app:drive',
            resolve: async () => {
                const { drive, encode, decode } = useDrive()

                return {
                    drive: unref(drive),
                    encode,
                    decode
                }
            }
        })
    )

    return resolvers
}