import uuid from 'uuid-random'

export default class View {
    public id: string
    public label?: string
    public readonly component: string = 'unknown'

    constructor(props?: Partial<View>, id?: string) {
        this.id = id || uuid()
        this.label = props?.label || ''
    }
}
