const interfaces = `
class Item {
    id: string;
    workspaceId?: string;
    collectionId?: string;
    [key: string]: any;
    constructor(props: any, id?: string);
}


interface GroupArray<T = any> {
    _items: T[]
}

type GetKey<Type, K extends keyof Type, R> = {
    [Property in keyof Pick<Type, K>]: R
}

class ArrayService<T = Record<string, any>> extends Array<T> {
    static from<T>(items: T[]): ArrayService<T>
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): ArrayService<T>
    groupBy<K extends keyof T>(key: K): ArrayGroupService<GroupArray<T> & GetKey<T, K, string>>
    sumBy<K extends keyof T>(key: K): any
}

class ArrayGroupService<T extends GroupArray> extends ArrayService<T> {
    sumItemsBy<K extends keyof T['_items'][number]>(
        key: K
    ): ArrayGroupService<T & GetKey<T, K, number>>
}

class CollectionService {
    list<T = Item>(): Promise<ArrayService<T>>
    exists(id: string): Promise<boolean>
    show(itemId: string): Promise<Item>
    create(data: Item): Promise<void>
    update(id: string, data: Partial<Item>): Promise<void>
    delete(id: string): Promise<void>
}

class WorkspaceService extends Workspace {
    collection(collectionId: string): Promise<CollectionService>
    items<T = Item>(collectionId: string): Promise<ArrayService<T>>
}

declare const workspace: WorkspaceService

declare function setResult(data: any): void
`

export default interfaces
