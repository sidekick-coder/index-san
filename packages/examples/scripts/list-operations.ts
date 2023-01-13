const entries = await Drive.list('/')

const operations = entries.filter(e => !['.is', 'list-operations.ts', 'execute.ts'].includes(e.name))

setResult(operations)
