export const monacoEditorEntryMiddleware = defineEntryMiddleware({
    order: 100,
    handle: async ({ entry }) => {
        
        if (entry.path.endsWith('.txt')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'plaintext',
                }
            }
        }
        
        if (entry.path.endsWith('.md')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'markdown',
                }
            }
        }

        if (entry.path.endsWith('.js')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'javascript',
                }
            }
        }
        if (entry.path.endsWith('.ts')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'typescript',
                }
            }
        }

        if (entry.path.endsWith('.json')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'json',
                }
            }
        }

        if (entry.path.endsWith('.css')) {
            return {
                page: 'monaco-editor',
                props: {
                    path: entry.path,
                    language: 'css',
                }
            }
        }
    }
})