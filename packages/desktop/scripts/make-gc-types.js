const fs = require('fs')
const path = require('path')

const camelCase = require('lodash/camelCase')
const upperFirst = require('lodash/upperFirst')

const BASE_PATH = path.resolve(__dirname, '..')

async function main() {
    const files = await fs.promises.readdir(path.resolve(BASE_PATH, 'components'))

    const output = files
        .filter((f) => f !== 'components.d.ts')
        .filter((f) => !/.spec.ts/.test(f))
        .map((filename) => [upperFirst(camelCase(filename.replace('.vue', ''))), filename])
        .map(
            ([name, filename]) =>
                `        ${name}: typeof import('@/components/${filename}')['default']`
        )

    output.unshift(
        "declare module '@vue/runtime-core' {",
        '    export interface GlobalComponents {'
    )

    output.push('    }', '}', '', 'export {}', '')

    const filename = path.resolve(BASE_PATH, 'components', 'components.d.ts')

    await fs.promises.mkdir(path.dirname(filename), { recursive: true })

    await fs.promises.writeFile(filename, output.join('\n'))
}

main()
