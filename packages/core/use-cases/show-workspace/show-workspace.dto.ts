import Workspace from "../../entities/workspace"


declare namespace ShowWorkspaceDTO {
    
    export interface Input {
        id: string
    }

    export interface Output extends Workspace {}
}

export default ShowWorkspaceDTO