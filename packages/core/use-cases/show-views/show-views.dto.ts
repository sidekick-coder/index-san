import View from '../../entities/view'

declare namespace ShowViewsDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
    }

    export interface Output {
        data: View[]
    }
}

export default ShowViewsDTO
