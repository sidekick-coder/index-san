import uuid from 'uuid-random'
import { Factory } from './base'
import Column, { ColumnType } from '../../entities/column'

const ColumnFactory = new Factory<Column>((data) => {
    const id = data?.id ?? uuid()

    return new Column(
        {
            id,
            name: id,
            type: ColumnType.text,
            field: id,
            ...data,
        },
        id
    )
})

export default ColumnFactory
