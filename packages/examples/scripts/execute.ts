
const items = [
    { file: 'sum.ts', scope: { a: 1, b: 2 } },
    { file: 'subtraction.ts', scope: { a: 5, b: 1 } },
    { file: 'list-operations.ts', scope: { } },
]

for await (const item of items) {
    await Evaluation.fromFile(item.file, item.scope).then(r => {
        console.log(item.file, r.result)
    })
}

