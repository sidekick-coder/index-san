interface Callback {
    (statements: string, moduleId: string): string
}

export function defineImportProcessor(cb: Callback) {
    return (code: string) => {
        const regex = /import\s+([a-zA-Z0-9_,\s{}]+)\s+from\s+['"](.*)['"]/g

        return code.replace(regex, (_, statements, moduleId) => cb(statements, moduleId))
    }
}
