const { resolve } = require('path')
const { transformer } = require('vue-wind')
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      accent: '#22C55E',
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      slate: colors.slate,
      red: colors.red,
    },
  },
  content: {
    files: ['src/client/**/*.vue'],
    transform: {
      vue: (content) => {
        const vWindSafeList = transformer(content)

        return [vWindSafeList, content].join('\n\n\n')
      },
    },
  },
  safelist: ['right-0', 'w-[300px]'],
  plugins: [],
}
