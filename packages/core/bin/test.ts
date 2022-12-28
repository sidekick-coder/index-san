import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
import { processCliArgs, configure, run } from '@japa/runner'

configure({
    ...processCliArgs(process.argv.slice(2)),
    ...{
        files: [
            './app.spec.ts',
            './gateways/*/*.spec.ts',
            './entities/*.spec.ts',
            './services/*.spec.ts',
            './exceptions/*.spec.ts',
            './repositories/**/**/*.spec.ts',
            './use-cases/**/*.spec.ts',
        ],
        plugins: [expect()],
        reporters: [specReporter()],
        importer: (filePath) => import(filePath),
    },
})

run()
