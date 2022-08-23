import { v4 as uuid } from 'uuid';

export default class Workspace {
    public id: string
    public name: string
    public path: string
    public drive: string
    public config: Record<string, string>

    constructor(props: Omit<Workspace, 'id'>, id?: string) {
        Object.assign(this, props)

        if (id) this.id = id

        if (!id) this.id = uuid()

    }
}