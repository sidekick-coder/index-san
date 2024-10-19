import type { HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { javascriptResolver } from "../resolvers/javascript";
import { vueResolver } from "../resolvers/vue";
import { driveResolver } from "../resolvers/drive";

interface Options {
	extend: HecateCompilerImportResolver[]
}

export function useGlobalResolvers(options?: Options) {
	const resolvers = [
		javascriptResolver,
		vueResolver,
		driveResolver,
		usePluginResolver()	
	]

	if (options?.extend) {
		resolvers.push(...options.extend)
	}

	return resolvers
}
