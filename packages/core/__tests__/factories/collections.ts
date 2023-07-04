import Collection, { RepositoryType } from '../../entities/collection'
import uuid from 'uuid-random'
import { Factory } from './base'

const CollectionFactory = new Factory<Collection>((data) => {
    const id = data?.id ?? uuid()

    return new Collection(
        {
            id,
            name: id,
            path: id,
            repositoryType: RepositoryType.Entry,
            columns: [],
            ...data,
        },
        id
    )
})

export default CollectionFactory
