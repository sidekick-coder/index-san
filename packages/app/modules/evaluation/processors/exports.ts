interface Callback {
    (key: string, statements: string): string
}

export function defineExportProcessor(cb: Callback) {
    return (code: string) => {
        let result = code

        result = result.replace(/export\s+default\s+({[\s\S]*})/g, (_, statements) => {
            return cb('default', statements)
        })

        // replace export default function (){ $statements } > __INDEX_SAN_EXPORT(function (){ $statements })
        result = result.replace(
            /export\s+default\s+function\s*\(\)\s*{([\s\S]*)}/g,
            (_, statements) => {
                return cb('default', `function (){${statements}}`)
            }
        )

        // replace export const $varname = $value > __INDEX_SAN_EXPORT({ $varname: $value })
        result = result.replace(
            /export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*([^\s;]+)/g,
            (_, varname, value) => {
                return cb(varname, value)
            }
        )

        return result
    }
}
