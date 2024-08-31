import { createCompiler, type HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { useGlobalResolvers } from "../composables/global-resolvers";

export const javascriptResolver: HecateCompilerImportResolver = {
	test: (key) => key.startsWith('/') && key.endsWith('.js'),
	resolve: async (key) => {
		return importJavascriptFile(key)
	}
}

export async function importJavascriptFile(filename: string) {
	const { drive: _drive, decode } = useDrive();

	const drive = _drive.value

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
		importResolvers: useGlobalResolvers(),
	});

	const result = await compiler.compile(text);

	if (result.error) {
		throw result.error;
	}

	return result.exports;

}

