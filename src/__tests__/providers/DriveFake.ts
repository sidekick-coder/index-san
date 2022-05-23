import Workspace from 'Entities/Workspace'
import IDrive from 'src/providers/IDrive'

interface FakeFiles {
  workspaceId: string
  path: string
  content: Buffer
}

export default class DriveFake implements IDrive {
  public files: FakeFiles[] = []

  public get(workspace: Workspace, path: string) {
    const file = this.files.find((f) => f.workspaceId === workspace.id && f.path === path)

    if (!file) return Promise.resolve(null)

    return Promise.resolve(file.content)
  }

  public async update(workspace: Workspace, path: string, content: Buffer | string) {
    const search = this.files.findIndex((f) => f.workspaceId === workspace.id && f.path === path)

    if (search !== -1) {
      this.files[search].content = typeof content === 'string' ? Buffer.from(content) : content
    }

    return Promise.resolve()
  }
}
