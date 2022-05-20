import 'reflect-metadata'
import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
// import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'

const files = ['src/**/*.spec.ts']

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files,
    plugins: [expect()],
    reporters: [specReporter()],
    importer: (filePath) => import(filePath),
  },
})

run()
