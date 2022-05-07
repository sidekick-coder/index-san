

const distExist = require('fs').existsSync('./dist');

if (!distExist) {
  throw new Error('dist directory not found');
}

require('./dist/main.js') 