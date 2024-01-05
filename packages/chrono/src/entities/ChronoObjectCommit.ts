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

    public static from(payload: Payload) {
        const object = ChronoObject.fromObject({ ...payload, type: 'commit' }, payload.body)

        return new ChronoObjectCommit(object.content)
    }

    public serialize() {
        return {
            ...super.serialize(),
            message: this.message,
        }
    }
}
