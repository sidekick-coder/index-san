const { resolve } = require('path')

const colors = require('tailwindcss/colors')
const { transformer } = require('vue-wind')

module.exports = {
  theme: {
    colors: {
      ...colors,
      accent: '#22C55E',
    },
  },
  content: {
    files: [
      resolve(__dirname, 'index.html'),
      resolve(__dirname, 'components/**/*.vue'),
      resolve(__dirname, 'views/**/*.vue'),
      resolve(__dirname, 'styles/*.css'),
      resolve(__dirname, '..', 'node_modules', 'vue-wind', 'safe-list.txt'),
    ],
    transform: {
      vue: (content) => {
        const vWindSafeList = transformer(content)

        return [vWindSafeList, content].join('\n\n')
      },
    },
  },
  plugins: [],
}
