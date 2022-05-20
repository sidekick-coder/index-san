import Application from 'src/entrypoint/electron'

const app = new Application()

app
  .start()
  .then(() => console.log('electron-preview: start successfully!'))
  .catch((err) => console.error(err))
