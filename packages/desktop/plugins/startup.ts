interface ModuleRouter {
    default?: () => void | Promise<void>
}

export default () => {
    const modulesRouter = import.meta.glob<Record<string, ModuleRouter>>('@modules/**/start.ts', {
        eager: true,
    })

    Promise.all(
        Object.values<ModuleRouter>(modulesRouter)
            .filter((m) => !!m.default)
            .map((m) => m.default!())
    )
}
