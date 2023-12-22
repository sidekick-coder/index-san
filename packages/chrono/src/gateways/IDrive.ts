export default interface IDrive {
    resolve: (...args: string[]) => string

    read: (path: string) => Promise<Uint8Array | null>
    write: (path: string, content: Uint8Array) => Promise<void>

    mkdir: (path: string) => Promise<void>
    readdir: (path: string) => Promise<string[]>
    exists: (path: string) => Promise<boolean>

    isFile: (path: string) => Promise<boolean>
    isDirectory: (path: string) => Promise<boolean>
}
