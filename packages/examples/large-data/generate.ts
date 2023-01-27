const repository = await createItemRepository("data")

const dataLength = 10000

const items = await repository.list()

for await (const i of Array.from(Array(dataLength - items.length).keys())) {
    await repository.create({
        name: 'Test - ' + i,
        done: Math.round(Math.random() * 1) === 1,
    })

    console.log(`create : ${i + 1}`)
}
