export const hephaestusEntryMiddleware = defineEntryMiddleware({
    order: 100,
    handle: async ({ entry }) => {
        if (entry.path.endsWith('.hph')) {
            return {
                page: 'hephaestus-editor',
                props: {
                    path: entry.path,
                }
            }
        }
    }
})