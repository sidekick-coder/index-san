import Workspace from '../../entities/workspace'

declare namespace ShowWorkspaceDTO {
    export interface Input {
        id: string
    }

    export type Output = Workspace
}

export default ShowWorkspaceDTO
