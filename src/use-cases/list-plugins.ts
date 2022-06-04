import { readdir, readFile } from 'fs/promises'
import path from 'path'

export default class ListPlugins {
  public async execute() {
    const render = await readFile(
      path.resolve(__dirname, '..', 'plugins', 'data-view', 'render.js')
    )

    return {
      render: render.toString(),
    }
  }
}
