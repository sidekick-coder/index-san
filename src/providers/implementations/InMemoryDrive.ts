import Item from 'Entities/Item'
import IDrive from 'Providers/IDrive'

interface MemoryFile {
  id: string
  workspaceId: string
  content: Buffer
}

export default class InMemoryDrive implements IDrive {
  public files: MemoryFile[] = []

  public async get(item: Item) {
    const file = this.files.find((i) => i.id === item.id && i.workspaceId === item.workspaceId)

    return file?.content || null
  }

  public async put(item: Item, content: Buffer) {
    const data = {
      id: item.id,
      workspaceId: item.workspaceId,
      content,
    }

    const index = this.files.findIndex(
      (f) => f.id === item.id && f.workspaceId === item.workspaceId
    )

    if (index === -1) {
      this.files.push(data)
      return
    }

    this.files[index] = data
  }

  public async delete(item: Item) {
    const index = this.files.findIndex(
      (f) => f.id === item.id && f.workspaceId === item.workspaceId
    )

    if (index === -1) {
      return
    }

    this.files.splice(index, 1)
  }
}
