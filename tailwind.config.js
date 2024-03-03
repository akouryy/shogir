/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.tsx',
    './pages/**/*.tsx',
  ],
  daisyui: {
    themes: [
      {
        myemerald: {
          ...require('daisyui/src/theming/themes').emerald,
          error: 'rgb(251 113 133)', // rose-400
        },
      },
    ],
  },
  plugins: [require('daisyui')],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Open Sans',
          'ヒラギノ丸ゴ ProN W4', 'Hiragino Maru Gothic ProN',
          '游ゴシック', 'YuGothic', 'Yu Gothic',
          'メイリオ', 'Meiryo',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
}
