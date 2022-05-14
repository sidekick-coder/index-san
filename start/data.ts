import fs from 'fs'
import App from '../app'

export default async (app: App) => {
  const files = ['options.json', 'workspaces.json']

  await Promise.all(
    files.map(async (file) => {
      const filename = app.userDataPath(file)

      const exists = await fs.promises
        .stat(filename)
        .then(() => true)
        .catch(() => false)

      if (!exists) {
        await fs.promises.writeFile(filename, JSON.stringify([]))
      }
    })
  )
}
