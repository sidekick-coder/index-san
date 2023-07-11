import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
import { processCliArgs, configure, run } from '@japa/runner'

configure({
    ...processCliArgs(process.argv.slice(2)),
    ...{
        files: [
            'src/app.spec.ts',
            'src/gateways/*/*.spec.ts',
            'src/entities/*.spec.ts',
            'src/services/*.spec.ts',
            'src/exceptions/*.spec.ts',
            'src/repositories/**/**/*.spec.ts',
            'src/use-cases/**/*.spec.ts',
        ],
        plugins: [expect()],
        reporters: [specReporter()],
        importer: (filePath) => {
            let filename = filePath

            const isWindows = process.platform === 'win32'

            if (isWindows) {
                filename = 'file:///' + filePath
            }

            return import(filename)
        },
    },
})

run()
