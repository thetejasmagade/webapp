const { colors: defaultColors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [ './index.html', './src/**/*.{vue,js,ts,jsx,tsx}' ],
  darkMode: false,
  theme: {
    extend: {},
    boxShadow: {
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      'none': 'none'
    },
    colors: {
      ...defaultColors,
      blue: {
        '200': '#C2C6E8',
        '300': '#9DA4DB',
        '400': '#7882CD',
        '500': '#5460C0',
        '600': '#3A469E',
        '700': '#2A3373',
        '800': '#1B2048'
      },
      gray: {
        '200': '#f0f0f0',
        '300': '#c2c2c2',
        '400': '#949494',
        '500': '#666666',
        '600': '#474747',
        '700': '#3c3c3c',
        '750': '#292929',
        '800': '#1d1d1d',
        '850': '#131313',
        '900': '#0a0a0a'
      },
      green: {
        '100': '#D9EED2',
        '200': '#C0E3B5',
        '300': '#A7D897',
        '400': '#8ECD79',
        '500': '#6FBF54',
        '600': '#5EB342',
        '700': '#4F9537',
        '800': '#3F772C',
        '900': '#2F5921'
      },
      gold: {
        '200': '#E8D7C2',
        '300': '#DBBF9D',
        '400': '#CDA778',
        '500': '#C08f54',
        '600': '#9E713A',
        '700': '#815D30',
        '800': '#48331B'
      },
      red: {
        '200': '#E8C2C6',
        '300': '#DB9DA4',
        '400': '#CD7882',
        '500': '#C05460',
        '600': '#9E3A46',
        '700': '#732A33',
        '800': '#481B20'
      }
    }
  },
  variants: {
    width: [ 'group-hover', 'responsive' ],
    extend: {
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
};
