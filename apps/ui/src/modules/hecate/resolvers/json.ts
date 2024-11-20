import { type HecateCompilerImportResolver } from "hecate/composables/createCompiler";

export const jsonResolver: HecateCompilerImportResolver = {
	test: (key) => key.startsWith('/') && key.endsWith('.json'),
	resolve: async (key) => {
		return importJson(key)
	}
}

export async function importJson(filename: string) {
	const drive = useWorkspaceDrive()

	const entry = await drive.get(filename);

	if (!entry) {
		throw new Error(`File not found: ${filename}`);
	}

	const contents = await drive.read(filename);

	if (!contents) {
		throw new Error(`Failed to read file: ${filename}`);
	}

	const text = decode(contents);

    return JSON.parse(text)
}

export async function writeJson(filename: string, data: any, options?: any) {
    const drive = useWorkspaceDrive()

    const text = JSON.stringify(data, null, 2)

    const contents = encode(text)

    await drive.write(filename, contents, {
        recursive: true,
    })
}

