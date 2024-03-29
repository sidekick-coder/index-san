interface ReadDirOptions {
    recursive?: boolean
    exclude?: string[]
    onlyFiles?: boolean
    onlyDirectories?: boolean
}

export default interface IDrive {
    resolve: (...args: string[]) => string

    findAllFiles: () => Promise<string[]>

    read: (path: string) => Promise<Uint8Array | null>
    write: (path: string, content: Uint8Array) => Promise<void>

    mkdir: (path: string) => Promise<void>
    readdir: (path: string, options?: ReadDirOptions) => Promise<string[]>
    exists: (path: string) => Promise<boolean>

    isFile: (path: string) => Promise<boolean>
    isDirectory: (path: string) => Promise<boolean>
}
