import Collection from '../../entities/collection'

declare namespace ListCollectionsDTO {
    export interface Input {
        workspaceId: string
    }

    export interface Output {
        data: Collection[]
    }
}

export default ListCollectionsDTO