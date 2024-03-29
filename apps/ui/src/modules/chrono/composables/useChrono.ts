import ChronoApp from 'chrono/src/ChronoApp'
import { useChronoDrive } from './useChronoDrive'
import { useChronoHash } from './useChronoHash'

export function useChrono(){
    const drive = useChronoDrive()
    const hash = useChronoHash()

    const app = new ChronoApp(drive, hash)

    return {
        app,
        drive,
        hash,
    }
}