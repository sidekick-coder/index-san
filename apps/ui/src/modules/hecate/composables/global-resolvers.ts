import type { HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { javascriptResolver } from "../resolvers/javascript";
import { vueResolver } from "../resolvers/vue";
import { driveResolver } from "../resolvers/drive";
import { pluginResolver } from "@/modules/plugin/composables/plugin-resolvers";

interface Options {
	extend: HecateCompilerImportResolver[]
}

export function useGlobalResolvers(options?: Options) {
	const resolvers = [
		javascriptResolver,
		vueResolver,
		driveResolver,
		pluginResolver
	]

	if (options?.extend) {
		resolvers.push(...options.extend)
	}

	return resolvers
}
