import Collection from '../../entities/collection'

export default interface UpdateCollectionsDTO {
    workspaceId: string
    collectionId: string
    data: Partial<Omit<Collection, 'id' | 'workspaceId'>>
}
