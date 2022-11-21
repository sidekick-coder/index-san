import uuid from 'uuid-random'

export default class Script {
    public id: string
    public name: string
    public content: string

    constructor(props: Omit<Script, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}
