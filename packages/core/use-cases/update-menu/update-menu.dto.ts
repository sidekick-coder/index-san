import Menu from '../../entities/menu'

declare namespace UpdateMenuDTO {
    export interface Input {
        workspaceId: string
        data: Menu[]
    }

    export interface Output {}
}

export default UpdateMenuDTO
