import Menu from '../../entities/menu'

declare namespace ShowMenuDTO {
    export interface Input {
        workspaceId: string
    }

    export interface Output {
        data: Menu[]
    }
}

export default ShowMenuDTO
