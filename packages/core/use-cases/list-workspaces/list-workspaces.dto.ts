import Workspace from '../../entities/workspace'

export declare namespace ListWorkspacesDTO {
    export interface Input {}

    export interface Output {
        data: Workspace[]
    }
}
