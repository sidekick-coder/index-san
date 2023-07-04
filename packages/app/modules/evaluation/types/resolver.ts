export interface Resolver {
    test: (id: string) => boolean
    order?: number
    resolve: (id: string) => Promise<any>
}
