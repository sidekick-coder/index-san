#!/usr/bin/env node
require("./register");

const path = require("path");

const appPath = path.resolve(__dirname, "src/index.ts");

require(appPath);
