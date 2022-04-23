const path = require("path");
const tsConfigPath = path.resolve(__dirname, "tsconfig.json");
const tsConfig = require(tsConfigPath);

require("ts-node").register({
    cwd: __dirname,
    project: tsConfigPath,
    transpileOnly: true,
});

require("tsconfig-paths").register({
    baseUrl: path.resolve(__dirname, tsConfig.compilerOptions.baseUrl),
    paths: tsConfig.compilerOptions.paths,
});
