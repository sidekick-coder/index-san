export const textEditorEntryMiddleware = defineEntryMiddleware({
    order: 100,
    handle: async ({ entry }) => {
        const extensions = ['txt']
        
        if (extensions.some(ext => entry.path.endsWith(ext))) {
            return {
                page: 'text-editor',
                props: {
                    path: entry.path
                }
            }
        }
    }
})