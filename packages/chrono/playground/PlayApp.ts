import ChronoApp from '../src/ChronoApp'
import PlayDrive from './PlayDrive'
import PlayHash from './PlayHash'

const drive = new PlayDrive()
const hash = new PlayHash()

const app = new ChronoApp(drive, hash)

// app.init()

app.objectService.hashAndSaveFile('message.md')
