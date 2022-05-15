import 'reflect-metadata'
import './helpers/ts-register'
import { app } from 'electron'
import App from './app'

async function main() {
  const indexSan = new App()

  await indexSan.boot()

  const window = await indexSan.createWindow()

  await window.loadFile(indexSan.publicPath('index.html'))
}

app
  .whenReady()
  .then(main)
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
