import ChronoApp from '../src/ChronoApp'
import PlayDrive from './PlayDrive'
import PlayHash from './PlayHash'

const drive = new PlayDrive()
const hash = new PlayHash()

const app = new ChronoApp(drive, hash)

async function run() {
    // app.init()

    // app.hashFile('message.md')

    console.log(await app.catFile('1cd0ff195e53a0a31601aae77b23e20e63f6d244'))
}

run()
