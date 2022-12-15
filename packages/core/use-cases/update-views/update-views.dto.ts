import View from '../../entities/view'

declare namespace UpdateViewsDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
        data: View[]
    }

    export interface Output {}
}

export default UpdateViewsDTO
