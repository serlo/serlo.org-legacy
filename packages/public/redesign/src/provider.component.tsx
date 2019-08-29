import { Grommet } from 'grommet'
import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { lighten, transparentize } from 'polished'

import { BreakpointProvider, setDefaultBreakpoints } from 'react-socks'

import './fonts/fonts.css'

export const Provider: React.FunctionComponent = ({ children }) => {
  return (
    <BreakpointProvider>
      <Grommet theme={theme}>{children}</Grommet>
    </BreakpointProvider>
  )
}

/* full grommet theme output for reference: https://github.com/serlo/athene2-blue-gum/wiki/Grommet-default-theme-export */

const theme = {
  xs: '0rem',
  sm: '48rem',
  md: '64rem',
  lg: '75rem',
  flexboxgrid: {
    gridSize: 12, // columns
    gutterWidth: 0, // rem
    outerMargin: 0, // rem
    mediaQuery: 'only screen',
    container: {
      sm: 46, // rem
      md: 61, // rem
      lg: 76 // rem
    },
    breakpoints: {
      xs: 0, // em
      sm: 48, // em
      md: 64, // em
      lg: 75 // em
    }
  },
  global: {
    colors: {
      //'active': 'rgba(221,221,221,0.5)',
      black: '#000000',
      //'border': {
      //  'dark': 'rgba(255,255,255,0.33)',
      //  'light': 'rgba(0,0,0,0.33)'
      //},
      brand: '#007ec1',
      brandGreen: '#95bc1a',
      darkGray: '#212529',
      //'control': {
      //  'dark': 'accent-1',
      //  'light': 'brand'
      //},
      //'focus': '#6FFFB0',
      //'placeholder': '#AAAAAA',
      //'selected': 'brand',
      //'text': {
      //  'dark': '#f8f8f8',
      //  'light': '#444444'
      //},
      //'white': '#FFFFFF',
      'accent-1': 'brandGreen',
      //'accent-2': '#FD6FFF',
      //'accent-3': '#81FCED',
      //'accent-4': '#FFCA58',
      'dark-1': '#333333',
      'dark-2': '#555555',
      //'dark-3': '#777777',
      //'dark-4': '#999999',
      //'dark-5': '#999999',
      //'dark-6': '#999999',
      //'light-1': '#F8F8F8',
      //'light-2': '#F2F2F2',
      //'light-3': '#EDEDED',
      //'light-4': '#DADADA',
      //'light-5': '#DADADA',
      //'light-6': '#DADADA',
      //'neutral-1': '#00873D',
      //'neutral-2': '#3D138D',
      //'neutral-3': '#00739D',
      //'neutral-4': '#A2423D',
      //'status-critical': '#FF4040',
      //'status-error': '#FF4040',
      //'status-warning': '#FFAA15',
      //'status-ok': '#00C781',
      //'status-unknown': '#CCCCCC',
      //'status-disabled': '#CCCCCC',
      lightBackground: '#f4fbff',
      lightblue: '#52a6d0',
      lighterblue: '#91c5e4',
      bluewhite: '#f0f7fb',
      helperblue: '#00b4d5',
      white: '#fff',
      transparent: 'rgba(255,255,255,0)'
    },
    borderSize: {
      xsmall: '1px',
      small: '2px',
      medium: '.2rem',
      large: '.4rem',
      xlarge: '1rem'
    },
    defaultTransition: 'all .2s ease-in-out;'
    // font: {
    //   size: '16px',
    //   height: '22px',
    //   maxWidth: '432px',
    //   family: 'Karmilla, sans-serif'
    // }
  },
  anchor: {
    textDecoration: 'none',
    fontWeight: 600,
    color: {
      dark: 'accent-1',
      light: 'brand'
    },
    hover: {
      textDecoration: 'none'
    },
    extend: (props: { theme: { global: { colors: { brand: string } } } }) => {
      const lightBlue = transparentize(0.35, props.theme.global.colors.brand)
      return `
        padding: 0 .15em;
        &:hover, &:focus {
          color: #fff;
          background-color: ${lightBlue};
          border-radius: .25em;
          // box-shadow: 0 0 0 .03em ${lightBlue};
          box-shadow: none;
        }
      `
    }
  },
  button: {
    color: {
      light: 'brand',
      dark: 'white'
    },
    border: {
      width: 0,
      radius: '5em'
    },
    disabled: {
      opacity: 0.3
    },
    extend: (props: {
      colorValue: string | number
      theme: { global: { colors: { [x: string]: any; brand: any } } }
      hasIcon: any
      secondary: any
      primary: any
    }) => {
      const backgroundColor = props.colorValue
        ? props.theme.global.colors[props.colorValue]
        : props.theme.global.colors.brand
      return `
        border-radius: .5rem;
        /* icon distance */
        > div > div {
          ${props.hasIcon ? 'width: .3em;' : ''}
        }
        > div > svg {
          ${props.hasIcon ? 'width: 0.75em' : ''}
        }
        ${
          props.secondary
            ? 'background-color: ' + transparentize(0.8, backgroundColor) + ';'
            : ''
        }
        ${props.colorValue || props.primary ? 'color: #fff' : ''}

        &:hover, &:focus {
          box-shadow: none;
          background-color: ${transparentize(0.5, backgroundColor)};
          ${props.secondary ? 'color: #fff' : ''}
        }
      `
    }
  }
}

export function getColor(
  colorName: keyof (typeof theme)['global']['colors']
): string {
  return theme.global.colors[colorName]
}

export function lightenColor(
  colorName: keyof (typeof theme)['global']['colors'],
  amount: number
): string {
  return lighten(amount, theme.global.colors[colorName])
}

export function transparentizeColor(
  colorName: keyof (typeof theme)['global']['colors'],
  amount: number
): string {
  return transparentize(amount, theme.global.colors[colorName])
}

export function getDefaultTransition() {
  return theme.global.defaultTransition
}

export function getBreakpoint(
  pointName: keyof (typeof theme)['flexboxgrid']['breakpoints']
): string {
  return theme.flexboxgrid.breakpoints[pointName] + 'rem'
}

let breakpoints: (keyof (typeof theme)['flexboxgrid']['breakpoints'])[] = [
  'xs',
  'sm',
  'md',
  'lg'
]

setDefaultBreakpoints(
  breakpoints.map(str => {
    return {
      [str]: theme.flexboxgrid.breakpoints[str] * 16
    }
  })
)

// export function getColor<K extends keyof (typeof theme)["global"]["colors"]>( colorName: K): ((typeof theme)["global"]["colors"][K]) {

export const GlobalStyle = createGlobalStyle`

html  {
    font-size: 16px;
    background-color: #fff;
  }
  body {
    font-family: 'Karmilla';
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.35;
    letter-spacing:-0.01em;
    // -webkit-text-stroke: .6px;
  }
  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    font-weight: 700;
  }
  @media (min-width: ${theme.flexboxgrid.breakpoints.md + 'rem'} ){
    html{
      font-size: 18px;
    }
  }
  @media (min-width: ${theme.flexboxgrid.breakpoints.lg + 'rem'}){
	html{
		font-size: 20px;
  }

	/*.container{
		max-width: 56rem !important;
		position: relative;
  }

	.wide-container{
		padding: 0 4rem;
	}*/
}
`
