import IDrive from 'Providers/IDrive'

export default class InMemoryDrive implements IDrive {
  public files = new Map<string, Buffer>()

  public async get(filename: string) {
    const file = this.files.get(filename)

    return file || null
  }

  public async put(filename: string, content: Buffer) {
    this.files.set(filename, content)
  }

  public async delete(filename: string) {
    this.files.delete(filename)
  }
}
