import uuid from 'uuid-random'

export default class View {
    public id: string
    public component: 'table'

    constructor(props: Omit<View, 'id'>, id?: string) {
        this.id = id ?? uuid()

        this.component = props.component
    }
}
