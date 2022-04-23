import { resolve } from "path";
import { expect } from "@japa/expect";
import { specReporter } from "@japa/spec-reporter";
import { runFailedTests } from "@japa/run-failed-tests";
import { processCliArgs, configure, run } from "@japa/runner";

configure({
    ...processCliArgs(process.argv.slice(2)),
    ...{
        files: [resolve(__dirname, "..", "src", "**", "*.spec.ts")],
        plugins: [expect()],
        reporters: [specReporter()],
        importer: (filePath) => import(filePath),
    },
});

run();
