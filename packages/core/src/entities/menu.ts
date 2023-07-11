import uuid from 'uuid-random'

export default class Menu {
    id: string
    label: string
    children: Menu[]

    isSection?: boolean
    to?: string
    icon?: string

    constructor(props: Omit<Menu, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}
