export const directoryMiddleware = defineEntryMiddleware(async ({ entry, router }) => {
    if (entry.type !== 'directory') {
        return
    }
    
    return router.replace(`/app/directory/${entry.path}`)
})