import Application from 'src/entrypoint/electron-dev'

const app = new Application()

app
  .start()
  .then(() => console.log('electron-dev: start successfully!'))
  .catch((err) => console.error(err))
