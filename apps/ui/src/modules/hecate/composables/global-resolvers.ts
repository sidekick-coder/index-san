import type { HecateCompilerImportResolver } from "hecate/composables/createCompiler";
import { javascriptResolver } from "../resolvers/javascript";
import { vueResolver } from "../resolvers/vue";
import { driveResolver } from "../resolvers/drive";
import { vueRouterResolver } from "../resolvers/vue-router";
import { snackbarResolver } from "../resolvers/snackbar";
import { hookResolver } from "../resolvers/hook";
import { utilsResolver } from "../resolvers/utils";
import { dialogResolver } from "../resolvers/dialog";

interface Options {
	extend: HecateCompilerImportResolver[]
}

export function useGlobalResolvers(options?: Options) {
	const resolvers = [
		javascriptResolver,
		vueResolver,
		vueRouterResolver,
		driveResolver,
		snackbarResolver,
		hookResolver,
		utilsResolver,
        dialogResolver,
		usePluginResolver()	
	]

	if (options?.extend) {
		resolvers.push(...options.extend)
	}

	return resolvers
}
