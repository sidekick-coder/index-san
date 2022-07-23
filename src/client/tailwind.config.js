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
      teal: colors.teal,
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
  plugins: [],
  safelist: [
    'right-0',
    'w-[300px]',
    'text-left',
    {
      pattern: /bg-*/,
      variants: ['focus', 'placeholder-shown', 'hover'],
    },
    {
      pattern: /text-*/,
      variants: ['focus', 'placeholder-shown', 'hover'],
    },
    {
      pattern: /border-*/,
      variants: ['focus', 'placeholder-shown', 'hover'],
    },
    {
      pattern: /fill-*/,
      variants: ['focus', 'placeholder-shown', 'hover'],
    },
    {
      pattern: /opacity-*/,
      variants: ['focus', 'placeholder-shown', 'hover'],
    },
  ],
}
