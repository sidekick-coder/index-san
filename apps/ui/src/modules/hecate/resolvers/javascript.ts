import { createCompiler, type HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { useGlobalResolvers } from "../composables/global-resolvers";

export const javascriptResolver: HecateCompilerImportResolver = {
    test: (key) => key.startsWith('/') && key.endsWith('.js'),
    resolve: async (key) => {
        return importJavascriptFile(key)
    }
}

export async function importJavascriptFile(filename: string) {
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

    const result = await compiler.compile(text, {
        filename: `/workspaces/${workspace.id}/entries/${filename}`,
    });

    if (result.error) {
        console.error(result.code)
        throw result.error;
    }

    return result.exports;

}

