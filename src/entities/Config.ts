export default class Config {
  // workspace-path
  public name: string
  public workspaceId: string
  public value: Record<string, any>

  constructor(data: Config) {
    Object.assign(this, data)
  }
}
