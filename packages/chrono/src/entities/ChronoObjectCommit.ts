import ChronoObject from './ChronoObject'

interface Payload {
    message: string
    tree: string
    parent?: string
    body?: string
}

export default class ChronoObjectCommit extends ChronoObject {
    public get message() {
        return this.head.message
    }

    public get tree() {
        return this.head.tree
    }

    public get parent() {
        return this.head.parent
    }

    public get date() {
        return this.head.date
    }

    public static from(payload: Payload) {
        const object = ChronoObject.fromObject({ ...payload, type: 'commit' }, payload.body)

        return new ChronoObjectCommit(object.content)
    }

    public serialize() {
        return {
            hash: this.hash,
            type: this.type,
            message: this.message,
            tree: this.tree,
            parent: this.parent,
            date: this.date,
        }
    }
}
