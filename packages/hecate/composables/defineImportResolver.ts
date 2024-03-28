export interface HecateCompilerImportResolver {
    test: (path: string) => boolean
    resolve: (path: string) => Promise<any>
}


export function defineImportResolver(props: HecateCompilerImportResolver) {
    return props
}