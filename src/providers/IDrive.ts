export default interface IDrive {
  get: (filename: string) => Promise<Buffer | string | null>
  put: (filename: string, content: Buffer) => Promise<void>
  delete: (filename: string) => Promise<void>
}
