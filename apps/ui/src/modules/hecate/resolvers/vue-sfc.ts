
import { defineImportResolver } from 'hecate/composables/defineImportResolver';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import { createCompiler } from 'hecate/composables/createCompiler';

export const vueSfcResolver = defineImportResolver({
    test: (path: string) => path.startsWith('/') && path.endsWith('.vue'),
    resolve: async (key) => {
        return importVueFile(key)
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

    const template = descriptor.template?.content || ''

    const scriptCompited = compileScript(descriptor, {
        id: filename,
    })

    let scriptCode = scriptCompited.content || ''

    scriptCode = scriptCode.replace("Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })", '')

    // add components
    const components: string[] = []

    Object.entries(scriptCompited.imports || {}).map(([key, value]) => {
        if (value.source.endsWith('.vue')) {
            components.push(key)
        }
    })

    scriptCode = scriptCode.replace('setup(', 'components: { ' + components.join(', ') + ' },\n  setup(')



    const compiler = createCompiler({
        globals: {
            __dirname: dirname(filename),
            __filename: filename
        },
        importResolvers: [
            ...useGlobalResolvers(),
        ],
        resolvePath: path => {
            const options = ['./', '../']

            if (!options.some(option => path.startsWith(option))) return path

            const folder = dirname(filename)

            const resolved = resolve(folder, path)

            if (resolved.startsWith('/')) return resolved

            return '/' + resolved 
        }
    });

    const { error, exports } = await compiler.compile(scriptCode, {
        filename: `/workspaces/${workspace.id}/entries/${filename}`,
    })


    if (error) {
        throw error;
    }

    const result = {
        ...exports.default,
        template,
    }

    return { default: result }
}

