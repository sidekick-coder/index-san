import uuid from 'uuid-random'

export enum ColumnType {
    text = 'text',
    number = 'number',
    select = 'select',
    relation = 'relation',
    script = 'script',
    entry = 'entry',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    link = 'link',
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
