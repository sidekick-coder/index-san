import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
import { processCliArgs, configure, run } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: [
      './gateways/*.spec.ts',
      './entities/*.spec.ts',
      './use-cases/**/*.spec.ts',
    ],
    plugins: [expect()],
    reporters: [specReporter()],
    importer: (filePath) => import(filePath),
  },
})

run()
