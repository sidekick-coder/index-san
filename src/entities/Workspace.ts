export default class Workspace {
  public readonly id: string
  public name: string
  public displayName: string

  // system path
  public path: string

  constructor(data: Omit<Workspace, 'id'>, id?: string) {
    Object.assign(this, data)

    if (id) {
      this.id = id
    }
  }
}
