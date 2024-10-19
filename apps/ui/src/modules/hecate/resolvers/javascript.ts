import { createCompiler, type HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { useGlobalResolvers } from "../composables/global-resolvers";

export const javascriptResolver: HecateCompilerImportResolver = {
	test: (key) => key.startsWith('/') && key.endsWith('.js'),
	resolve: async (key) => {
		return importJavascriptFile(key)
	}
}
export function useRelativeResolvers(filename: string) {
	const resolvers: HecateCompilerImportResolver[] = []

	resolvers.push({
		test: (key) => key.startsWith('./') && key.endsWith('.js'),
		resolve: async (key) => {
			const folder = dirname(filename)

			return importJavascriptFile(resolve(folder, key.replace('./', '')))
		}
	})

	return resolvers
}

export async function importJavascriptFile(filename: string) {
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

	const compiler = createCompiler({
		importResolvers: [
			...useGlobalResolvers(),
			...useRelativeResolvers(filename)
		] 
	});

	const result = await compiler.compile(text);

	if (result.error) {
		console.error(result.code)
		throw result.error;
	}

	return result.exports;

}

