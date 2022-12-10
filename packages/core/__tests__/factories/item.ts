import Item from '../../entities/item'
import uuid from 'uuid-random'
import { Factory } from './base'

const ItemFactory = new Factory<Item>((data) => {
    const id = uuid()

    return new Item({
        id,
        name: id,
        ...data,
    })
})

export default ItemFactory
