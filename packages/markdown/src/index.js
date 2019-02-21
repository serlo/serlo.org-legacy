import Showdown from 'showdown'

import codePrepare from './extensions/serlo_code_prepare'
import injections from './extensions/injections'
import table from './extensions/table'
import htmlStrip from './extensions/html_strip'
import latex from './extensions/latex'
import atUsername from './extensions/at_username'
import strikeThrough from './extensions/strike_through'
import spoiler from './extensions/spoiler'
import spoilerPrepare from './extensions/spoiler_prepare'
import latexOutput from './extensions/latex_output'
import codeOutput from './extensions/serlo_code_output'

export const converter = new Showdown.Converter({
  extensions: [
    codePrepare,
    injections,
    table,
    htmlStrip,
    latex,
    atUsername,
    strikeThrough,
    spoiler,
    spoilerPrepare,
    latexOutput,
    codeOutput
  ]
})
