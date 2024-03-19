export const directoryEntryMiddleware = defineEntryMiddleware({
    order: 100,
    handle: async ({ entry }) => {        
        if (entry.type === 'directory') {
            return {
                page: 'directory',
                props: {
                    path: entry.path
                }
            }
        }
    }
})