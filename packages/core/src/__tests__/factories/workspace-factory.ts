import Workspace from '../../entities/workspace'
import uuid from 'uuid-random'
import { Factory } from './base'

const WorkspaceFactory = new Factory<Workspace>((data) => {
    const id = uuid()

    return new Workspace({
        name: id,
        driveName: 'memory',
        config: {},
        ...data,
    })
})

export default WorkspaceFactory
