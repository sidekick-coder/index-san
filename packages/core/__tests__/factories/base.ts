export class Factory<T> {
    constructor(private define: (data?: Partial<T>) => T) {}

    public create(data?: Partial<T>) {
        return this.define(data)
    }

    public createMany(data?: Partial<T>, count = 5) {
        const items: T[] = []

        for (let i = 0; i < count; i++) {
            items.push(this.define(data))
        }

        return items
    }
}
