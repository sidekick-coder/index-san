import indexSan from '../app'

export default async (app: indexSan) => {
  const { electron } = app

  electron.protocol.registerFileProtocol('asset', (request, callback) => {
    const url = request.url.replace('asset:', '')

    callback({ path: url })
  })
}
