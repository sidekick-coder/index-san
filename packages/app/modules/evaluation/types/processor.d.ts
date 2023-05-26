export default interface Processor {
    order?: number
    process: (code: string) => string | undefined
}
