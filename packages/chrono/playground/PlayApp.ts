import ChronoApp from '../src/ChronoApp'
import PlayDrive from './PlayDrive'
import PlayHash from './PlayHash'

const drive = new PlayDrive()
const hash = new PlayHash()

const app = new ChronoApp(drive, hash)

async function run() {
    const commandName = process.argv[2]
    const commandArgs = process.argv.slice(3)

    const options = [
        {
            name: 'init',
            method: 'init',
        },
        {
            name: 'hash',
            method: 'hashEntry',
        },
        {
            name: 'cat',
            method: 'catEntry',
        },
        {
            name: 'add',
            method: 'addEntry',
        },
        {
            name: 'remove',
            method: 'removeEntry',
        },
        {
            name: 'commit',
            method: 'commit',
        },
        {
            name: 'status',
            method: 'status',
        },
        {
            name: 'list',
            method: 'list',
        },
    ]

    const command = options.find((o) => o.name === commandName)

    if (!command) {
        console.log('Invalid command')

        return
    }

    console.log(await app[command.method](...commandArgs))
}

run()
