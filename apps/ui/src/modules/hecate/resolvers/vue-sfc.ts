
import { defineImportResolver } from 'hecate/composables/defineImportResolver';
import { parse } from '@vue/compiler-sfc'
import { createCompiler } from 'hecate/composables/createCompiler';
import { useRelativeResolvers } from './javascript';
import HVariable from 'hecate/nodes/HVariable';
import HFunction from 'hecate/nodes/HFunction';
import HAsyncFunction from 'hecate/nodes/HAsyncFunction';
import HImport from 'hecate/nodes/HImport';
import { argv0 } from 'process';
import HImportDefault from 'hecate/nodes/HImportDefault';

export const vueSfcResolver = defineImportResolver({
    test: (path: string) => path.endsWith('.vue'),
    resolve: async () => {
        return {}
    }
})

export async function importVueFile(filename: string) {
    const drive = useWorkspaceDrive()
    const workspace = useCurrentWorkspace()

    const entry = await drive.get(filename);

    if (!entry) {
        throw new Error(`File not found: ${filename}`);
    }

    const contents = await drive.read(filename);

    if (!contents) {
        throw new Error(`Failed to read file: ${filename}`);
    }

    const text = decode(contents);

    const { descriptor } = parse(text, {
        filename,
    })

    const compiler = createCompiler({
        globals: {
            __dirname: dirname(filename),
            __filename: filename
        },
        importResolvers: [
            ...useGlobalResolvers(),
            ...useRelativeResolvers(filename)
        ]
    });

    let code = descriptor.scriptSetup?.content || ''

    const hNodes = compiler.toNodes(code)

    const properties = [] as string[]

    hNodes.forEach(n => {
        if (n instanceof HVariable) {
            properties.push(n.name)
        }

        if (n instanceof HFunction) {
            properties.push(n.name)
        }

        if (n instanceof HAsyncFunction) {
            properties.push(n.name)
        }

        if (n instanceof HImport) {
            n.properties.forEach(p => {
                properties.push(p.name)
            })
        }
    })

    const lastImport = hNodes.findLast(n => n instanceof HImport || n instanceof HImportDefault)

    const endImports = lastImport?.end ? lastImport.end + 1 : 0

    const transformedCode = [
        code.slice(0, endImports),
        '\nexport function setup(){',
        code.slice(endImports),
        'return {',
        properties.map(p => `${p},`).join('\n'),
        '}',
        '}'
    ].join('')

    const result = await compiler.compile(transformedCode, {
        filename: `/workspaces/${workspace.id}/entries/${filename}`,
    })

    if (result.error) {
        throw result.error;
    }

    return {
        default: {
            template: descriptor.template?.content,
            setup: result.exports.setup
        }
    }
}

