import Item from '../../entities/item'
import uuid from 'uuid-random'
import { Factory } from './base'

const ItemFactory = new Factory<Item>((data) => {
    const id = data?.id || uuid()

    return new Item(
        {
            name: id,
            ...data,
        },
        id
    )
})

export default ItemFactory
