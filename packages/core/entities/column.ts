import uuid from 'uuid-random'

export enum ColumnType {
    text = 'text',
    number = 'number',
    select = 'select',
    link = 'link',
    date = 'date',
    checkbox = 'checkbox',
    script = 'script',
    relation = 'relation',
    entry = 'entry',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

export default class Column {
    public id: string
    public field: string
    public type: ColumnType
    public label: string;

    [key: string]: any

    constructor(props: Omit<Column, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()

        this.field = props.field ?? this.id
        this.type = props.type ?? ColumnType.text
    }
}
