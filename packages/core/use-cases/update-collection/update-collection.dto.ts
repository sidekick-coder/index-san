import Collection from '../../entities/collection'

declare namespace UpdateCollectionsDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
        data: Partial<Omit<Collection, 'id'>>
    }

    // export interface Output {}
}

export default UpdateCollectionsDTO
