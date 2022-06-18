interface BaseRepository<T> {
  create(data: T): Promise<T>
}

export class BaseFactory<T> {
  constructor(private readonly repository: BaseRepository<T>) {}

  public make(data?: Partial<T>) {
    return (data ?? {}) as T
  }

  public async create(data?: Partial<T>) {
    return this.repository.create(this.make(data))
  }

  public async createMany(data?: Partial<T>, count = 5) {
    const items = []

    for (let i = 0; i < count; i++) {
      const formatted = JSON.stringify(data ?? {}).replace(/%i/g, String(i))

      const item = await this.create(JSON.parse(formatted))

      items.push(item)
    }

    return items
  }
}
