// read a file in root worksapce

const bytes = await Drive.read('hello.md')

const text = bytes ? Entry.decode(bytes) : ''

setResult(text)