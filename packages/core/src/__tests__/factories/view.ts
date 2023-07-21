import { faker } from '@faker-js/faker'
import uuid from 'uuid-random'
import { Factory } from './base'
import View from '../../entities/view'
import ViewTable from '../../entities/view-table'

export const ViewFactory = new Factory<View>((data) => {
    const id = data?.id ?? uuid()

    return new View(
        {
            label: faker.person.firstName(),
            ...data,
        },
        id
    )
})

export const ViewTableFactory = new Factory<ViewTable>((data) => {
    const id = data?.id ?? uuid()

    return new ViewTable(
        {
            label: faker.person.firstName(),
            ...data,
        },
        id
    )
})

export default ViewFactory
