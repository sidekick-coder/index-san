import { cpSync, rmSync } from 'fs'
import { resolve } from 'path'
import execa from 'execa'
import { colorize, createTimer } from '../helpers'
export class Builder {
  public paths = {
    dist: 'dist',
    public: 'public',
  }

  constructor(public appPath = resolve(__dirname, '..')) {
    this.paths.dist = resolve(appPath, 'dist')
    this.paths.public = resolve(appPath, 'public')
  }

  async vue() {
    const timer = createTimer()
    console.log(colorize('resources: building...', 'green'))

    const bin = resolve(this.appPath, 'node_modules', '.bin', 'vite')
    const source = resolve(this.appPath, 'resources')

    await execa(bin, ['build', source, '--emptyOutDir'])
      .then(() => console.log(colorize('resources: build successfully!', 'green')))
      .catch((err) => console.error(err))

    console.log(colorize(`resources: build-time ${timer.get()}ms`, 'green'))
  }

  async tsc() {
    const timer = createTimer()
    console.log(colorize('tsc: building...', 'blue'))

    const bin = resolve(this.appPath, 'node_modules', '.bin', 'tsc')
    const config = resolve(this.appPath, 'tsconfig.json')

    await execa(bin, ['-p', config])
      .then(() => console.log(colorize('tsc: build successfully!', 'blue')))
      .catch((err) => console.error(err))

    console.log(colorize(`tsc: build-time ${timer.get()}ms`, 'blue'))
  }

  postBuild() {
    rmSync(resolve(this.paths.dist, 'public'), { recursive: true })

    return cpSync(this.paths.public, resolve(this.paths.dist, 'public'), {
      recursive: true,
    })
  }

  async build() {
    await this.vue()

    await this.tsc()

    this.postBuild()
  }
}

if (require.main === module) {
  new Builder().build()
}
