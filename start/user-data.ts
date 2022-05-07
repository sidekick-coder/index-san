import fs from 'fs'
import { resolve } from 'path'
import { app } from 'electron'

export default async () => {
    const files = [
        'options.json',
        'workspaces.json',
    ]

    await Promise.all(files.map(async file => {
        const filename = resolve(app.getPath('userData'), file)
        const exists = await fs.promises.stat(filename).then(() => true).catch(() => false)

        if (!exists) {
            await fs.promises.writeFile(filename, JSON.stringify([]))
        }
    }))
}
