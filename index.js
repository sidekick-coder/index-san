#!/usr/bin/env node
const path = require("path");
const tsConfigPath = path.resolve(__dirname, "tsconfig.json");
const tsConfig = require(tsConfigPath);

require("ts-node").register({
    cwd: __dirname,
});

require("tsconfig-paths").register({
    baseUrl: path.resolve(__dirname, tsConfig.compilerOptions.baseUrl),
    paths: tsConfig.compilerOptions.paths,
});

const appPath = path.resolve(__dirname, "src/index.ts");

require(appPath);
