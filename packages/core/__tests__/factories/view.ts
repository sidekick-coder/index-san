import { faker } from '@faker-js/faker'
import uuid from 'uuid-random'
import { Factory } from './base'
import View from '../../entities/view'

const ViewFactory = new Factory<View>((data) => {
    const id = data?.id ?? uuid()

    return new View(
        {
            component: faker.helpers.arrayElement(['table']),
            ...data,
        },
        id
    )
})

export default ViewFactory
