import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'

interface GroupArray<T = any> {
    _items: T[]
}

type GetKey<Type, K extends keyof Type, R> = {
    [Property in keyof Pick<Type, K>]: R
}

class ArrayService<T = Record<string, any>> extends Array<T> {
    public static from<T>(items: T[]) {
        const array = new ArrayService<T>()

        array.push(...items)

        return array
    }

    public groupBy<K extends keyof T>(key: K) {
        const array = new ArrayGroupService<GroupArray<T> & GetKey<T, K, string>>()

        Object.entries(groupBy(this, key)).map(([group, items]) =>
            array.push({ [key]: group, _items: ArrayService.from(items) } as any)
        )

        return array
    }

    public sumBy<K extends keyof T>(key: K) {
        return sumBy(this, String(key))
    }
}

class ArrayGroupService<T extends GroupArray> extends ArrayService<T> {
    public sumItemsBy<K extends keyof T['_items'][number]>(key: K) {
        const array = new ArrayGroupService<T & GetKey<T, K, number>>()

        this.forEach((entry) => {
            array.push({
                ...entry,
                [key]: sumBy(entry._items, String(key)),
            })
        })

        return array
    }
}

export default ArrayService
