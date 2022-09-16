import uuid from 'uuid-random'

export default class Workspace {
    public id: string
    public name: string
    public path: string
    public drive: string
    public config: Record<string, string>

    constructor(props: Omit<Workspace, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}