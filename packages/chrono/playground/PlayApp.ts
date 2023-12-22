import ChronoApp from '../src/ChronoApp'
import PlayDrive from './PlayDrive'
import PlayHash from './PlayHash'

const drive = new PlayDrive()
const hash = new PlayHash()

const app = new ChronoApp(drive, hash)

async function run() {
    const command = process.argv[2]

    if (command === 'init') {
        await app.init()
    }

    if (command === 'hash') {
        console.log(await app.hashFile(process.argv[3]))
    }

    if (command === 'cat') {
        console.log(await app.catFile(process.argv[3]))
    }
}

run()
