import Item from 'Entities/Item'

export default interface IDrive {
  get: (item: Item) => Promise<Buffer | null>
  put: (item: Item, content: Buffer) => Promise<void>
  delete: (item: Item) => Promise<void>
}
