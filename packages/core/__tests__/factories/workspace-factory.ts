import Workspace from '../../entities/workspace'
import uuid from 'uuid-random'
import { Factory } from './base'

const WorkspaceFactory = new Factory<Workspace>((data) => {
    const id = uuid()

    return new Workspace({
        name: id,
        drive: 'local',
        path: `/${id}`,
        config: {},
        ...data
    })
})

export default WorkspaceFactory