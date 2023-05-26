import { defineExportProcessor } from '../processors/exports'
import { defineImportProcessor } from '../processors/imports'
import Processor from '../types/processor'
import Resolver from '../types/resolver'

const prefix = '__INDEX_SAN'

export function useEvaluation() {
    const state = {
        resolvers: [] as Resolver[],
        processors: [] as Processor[],
    }

    function addResolver(resolver: Resolver) {
        state.resolvers.push({
            order: 99,
            ...resolver,
        })
    }

    function addProcessor(Processor: Processor) {
        state.processors.push({
            order: 99,
            ...Processor,
        })
    }

    function setResolvers(resolvers: Resolver[]) {
        state.resolvers = resolvers
    }

    function findModuleImportNames(code: string) {
        const regex = /import\s+([a-zA-Z0-9_,\s{}]+)\s+from\s+['"](.*)['"]/g

        const matched = code.matchAll(regex)

        if (!matched) {
            return []
        }

        return Array.from(matched).map((m) => m[2])
    }

    async function findModules(source: string) {
        const names = findModuleImportNames(source)

        const resolved = {} as Record<string, any>
        const notResolved = [] as string[]

        for await (const moduleId of names) {
            const resolver = state.resolvers.find((r) => r.test(moduleId))

            if (!resolver) {
                notResolved.push(moduleId)
                continue
            }

            const moduleResolved = await resolver.resolve(moduleId)

            if (!moduleResolved) {
                notResolved.push(moduleId)
                continue
            }

            resolved[moduleId] = moduleResolved
        }

        return { resolved, notResolved }
    }

    async function mount(source: string) {
        state.resolvers.sort((a, b) => (a.order || 99) - (b.order || 99))
        state.processors.sort((a, b) => (a.order || 99) - (b.order || 99))

        let code = source
        const { resolved, notResolved } = await findModules(source)
        const errors = [] as Error[]

        notResolved.forEach((moduleId) => {
            errors.push(new Error(`Module ${moduleId} not found`))
        })

        code = state.processors.reduce((code, Processor) => Processor.process(code) || code, code)

        return {
            imports: resolved,
            errors,
            code,
        }
    }

    function evaluate(source: string, context = {}) {
        let wrapCode = source

        // replace all keys with this.[key]
        Object.keys(context).forEach((key) => {
            wrapCode = wrapCode.replace(new RegExp(key, 'g'), `this.${key}`)
        })

        const fn = new Function(wrapCode)

        // update name
        Object.defineProperty(fn, 'name', { value: 'useEvaluate' })

        fn.call(context)
    }

    async function run(source: string) {
        const spec = await mount(source)

        if (spec.errors.length) {
            return Promise.reject(spec.errors[0])
        }

        const exported = {} as Record<string, any>

        const context = {
            [`${prefix}_IMPORT`]: (moduleId: string) => spec.imports[moduleId],
            [`${prefix}_EXPORT`]: (newExported: Record<string, any>) => {
                Object.assign(exported, newExported)
            },
        }

        evaluate(spec.code, context)

        return exported
    }

    // add default processors
    addProcessor({
        process: defineExportProcessor((key, value) => {
            return `${prefix}_EXPORT({ ${key}: ${value} });`
        }),
    })

    addProcessor({
        process: defineImportProcessor((statements, moduleId) => {
            return `const ${statements} = ${prefix}_IMPORT("${moduleId}");`
        }),
    })

    return {
        mount,
        evaluate,
        run,
        addResolver,
        addProcessor,
        setResolvers,
    }
}
