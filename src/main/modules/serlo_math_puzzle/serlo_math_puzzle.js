/**
 *
 * Interactive Mathematical Puzzles
 *
 * @author  Stefan Dirnstorfer
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 */

import $ from 'jquery'
import d3 from 'd3'

import touchop from './serlo_math_puzzle_touchop'
import verify from './serlo_math_puzzle_algebra'

function makePuzzle (parent, inputStr) {
  var emog,
    svg,
    redraw,
    toggleFullscreen,
    operatorNames,
    operatorParent,
    i,
    palette,
    solution
  var showResult = false
  var challengeStr = inputStr.split('|')[0]
  var startStructureStr = inputStr.split('|')[1]

  // status image
  emog = d3
    .select(parent)
    .append('div')
    .attr('class', 'fullscreen-toggle')

  // svg canvas
  svg = d3
    .select(parent)
    .append('svg')
    .attr('width', '100%')
    .attr('viewBox', '0 0 600 400')

  /* var res = d3
    .select(parent)
    .append('div')
    .attr('class', 'end-result') */

  // fullscreen logic
  var fullscreen
  toggleFullscreen = function () {
    fullscreen = fullscreen ? undefined : parent
    redraw()
  }

  redraw = function () {
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent('resize', false, false, {})
    window.dispatchEvent(evt)
  }
  window.addEventListener('resize', function () {
    if (fullscreen === parent) {
      var windowWidth = d3.select('body').node().offsetWidth
      var width = Math.min(windowWidth - 20, 3 / 2 * (window.innerHeight - 20))
      var height = Math.min(window.innerHeight - 20, 2 / 3 * (windowWidth - 20))
      d3
        .select(parent)
        .classed('fullscreen', true)
        .style('position', 'fixed')
        .style('z-index', 20)
        .style(
          'outline-width',
          Math.max(window.innerHeight - height, window.innerWidth - width) +
            'px'
        )
        .style('top', (window.innerHeight - height) / 2 + 'px')
        .style('left', (window.innerWidth - width) / 2 + 'px')
        .style('width', width + 'px')
        .style('height', height + 'px')
    } else {
      d3
        .select(parent)
        .classed('fullscreen', false)
        .style('z-index', 0)
        .style('outline-width', '1px')
        .style('position', '')
        .style('top', '')
        .style('left', '')
        .style('width', '')
        .style('height', '')
    }
  })

  emog.on('click', function () {
    toggleFullscreen()
  })
  redraw()

  // arrow
  svg
    .append('path')
    .attr(
      'd',
      'm 321,278 c -6,0 -10,2 -12,5 -8,1 -10,5 -11,8 l -29,-10 -3,0 c 3,5 0,9 -5,9 1,0 2,1 4,2 l 26,9 c -1,2 0,2 0,4 18,6 35,21 45,12 l 13,4 c 0,0 7,-22 8,-25 -3,-1 -8,-3 -8,-3 0,-4 -4,-7 -8,-11 -6,-4 -11,-4 -15,-4 z m -58,2 c -4,0 -7,4 -4,8 7,1 8,-4 4,-8 z m 13,-60 -62,46 34,0 c -5,24 -48,50 -97,55 l 117,0 c 5,-6 10,-13 13,-20 l 0,0 -23,-10 c -7,-3 -2,-16 8,-13 l 22,7 c 2,-6 3,-10 4,-17 l 32,0 z'
    )
    .style('fill', 'lightgray')

  // insert the operators
  // var initialOp;
  // initialOp=addOperand(svg)
  solution = addOperand(svg)
    .attr('transform', 'translate(250,150)')
    .attr('data-frozen', true)
    .attr('data-goal', 'true')
  solution.node().goal= parsePn(challengeStr.split(/=/)[0])
  operatorNames = challengeStr.replace(/.*= */, '').split(/ +/)
  palette = addPalette(svg)
  for (i in operatorNames) {
    operatorParent = palette.append('g').attr('data-container-id', i)
    addNamedOperator(operatorNames[i], operatorParent)
    if (operatorNames[i] === '!') showResult = true
  }

  // TODO split('|') data
  /* if (startStructure)
        initializeStructure(JSON.parse(startStructure), solution); */
  if (startStructureStr) {
    initializeStructure(parsePn(startStructureStr), solution)
  }

  if (showResult) {
    svg.on('mouseover', function () {
      var val = touchop.getCurrentValue()
      if (val) {
        val = Math.round(val * 1000) / 1000
        d3
          .select(parent)
          .select('.end-result')
          .html('= ' + val)
      } else {
        d3
          .select(parent)
          .select('.end-result')
          .html('= ?')
      }
    })
  }
  touchop.setupCanvas(svg[0][0])
}

function addNamedOperator (operatorName, parent) {
  switch (operatorName) {
    case '^':
      return addPower(parent)
    case '/':
      return addDivide(parent)
    case '*':
      return addTimes(parent)
    case '+':
      return addPlus(parent)
    case '-':
      return addMinus(parent)
    case 'pi':
      return addAtom(parent, 'Math.PI', '\u03C0')
    case '!':
      return
    default:
      if (operatorName.match(/[0-9.]+/)) {
        return addAtom(parent, operatorName)
      }
      if (operatorName.match(/^\$.*/)) {
        return addAtom(parent, operatorName, operatorName.substring(1))
      }
      if (operatorName)
        throw new Error("Unknown operator");
  }
}

function initializeStructure (array, parent) {
  var g, ops, literals
  if (array.constructor === Array) {
    g = addNamedOperator(array[0], parent)
    g.attr('data-frozen', true)
    ops = g.selectAll('.operand')
    ops.attr('data-frozen', true)
    ops.each(function (x, i) {
      initializeStructure(array[i + 1], d3.select(this))
    })
  } else if (array !== '#'){
    addNamedOperator(array.toString(), parent);
  }
  literals = parent.selectAll('.atom')
  literals.attr('data-frozen', true)
}

function safePop(stack) {
  let value = stack.pop();
  if (value === undefined) value='#';
  return value;
}

// Parse polish notation String into start_structure JSON
function parsePn (string) {
  return string
    .split(/ +/)
    .reverse()
    .filter(function (x) {
      return x
    })
    .reduce((stack, value) => {
      var isOperator = value.match(/[+*/^-]/)
      if (isOperator) {
        stack.push([value, safePop(stack), safePop(stack)])
      } else {
        stack.push(value)
      }
      return stack
    }, [])
    .pop() || '#';
}

// A palette for holding items
function addPalette (elt) {
  var palette = elt
    .append('g')
    .attr('class', 'palette')
    .attr('transform', 'translate(0,330)')
    .attr('data-layout', 'paletteLayout')
    .attr('data-ismovable', 'false')
  palette
    .append('rect')
    .attr('width', 600)
    .attr('height', 70)
    .attr('fill', 'lightblue')
  return palette
}

// A literal placed on the screen
function addLiteral (elt, value) {
  var len = value.toString().replace(/ /g, '').length
  elt
    .append('rect')
    .attr('class', 'background')
    .attr('height', '60')
    .attr('rx', '5')
    .attr('ry', '5')
    .attr('width', 30 + 30 * len)
    .attr('x', -15 * len)
  elt
    .append('text')
    .attr('transform', 'translate(15,45)')
    .attr('class', 'atom')
    .text(value.toString())
}

// Atomic element with text
function addAtom (elt, value, text) {
  var g = elt
    .append('g')
    .attr('data-atom', value)
    .attr('data-value', value) // deprecated
    .attr('data-ismovable', 'true')
    .attr('class', 'atom')
  addLiteral(g, text || value)
  g[0][0].addEventListener('mousedown', touchop.msDown)
  return g
}

// Generic drop area for operator arguments
function addOperand (elt) {
  var g = elt
    .append('g')
    .attr('data-layout', 'snap')
    .attr('class', 'operand')
  g
    .append('rect')
    .attr('height', '50')
    .attr('width', '50')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('class', 'background')
  return g
}

function addOperator (elt) {
  var g = elt.append('g').attr('data-ismovable', 'true')
  g
    .append('rect')
    .attr('class', 'background')
    .attr('rx', 5)
    .attr('ry', 5)
  return g
}

function addPower (elt) {
  var g, exponent
  g = addOperator(elt)
    .attr('data-operator', '^')
    .attr('data-value', 'Math.pow(#1, #2)')
    .attr('data-priority', 91)
    .attr('data-layout', 'horizontalLayout')
  addOperand(g)
  exponent = g.append('g').attr('data-priority', 80)
  exponent
    .append('rect')
    .attr('y', 50)
    .attr('width', 1)
    .attr('height', 1)
  addOperand(
    exponent.append('g').attr('transform', 'scale(0.6) translate(0,-50)')
  )
  return g
}

function addDivide (elt) {
  var g = addOperator(elt)
    .attr('data-operator','/')
    .attr('data-value', '#1 / #2')
    .attr('data-priority', '99')
    .attr('data-layout', 'verticalLayout')
  g
    .append('g')
    .attr('transform', 'scale(0.8)')
    .attr('data-priority', '100')
  addOperand(g)
  g
    .append('rect')
    .attr('width', 80)
    .attr('height', 3)
    .attr('data-layoutOpt', 'stretch')
  g
    .append('g')
    .attr('transform', 'scale(0.8)')
    .attr('data-priority', '100')
  addOperand(g)
  return g
}

// Multiplication operator
function addTimes (elt) {
  var g = addOperator(elt)
    .attr('data-operator', '*')
    .attr('data-value', '#1 * #2')
    .attr('data-priority', '100')
    .attr('data-layout', 'horizontalLayout')
  addOperand(g)
  g.append('text').text('\u2022')
  addOperand(g)
  return g
}

// Addition operator
function addPlus (elt) {
  var g = addOperator(elt)
    .attr('data-operator', '+')
    .attr('data-value', '#1 + #2')
    .attr('data-priority', '120')
    .attr('data-layout', 'horizontalLayout')
  addOperand(g)
  g.append('text').text('+')
  addOperand(g)
  return g
}

// Difference operator
function addMinus (elt) {
  var g = addOperator(elt)
    .attr('data-operator', '-')
    .attr('data-value', '#1 - #2')
    .attr('data-priority', '111')
    .attr('data-layout', 'horizontalLayout')
  addOperand(g)
  g.append('text').text('-')
  addOperand(g)
  return g
}

$.fn.MathPuzzle = function () {
  return $(this).each(function () {
    makePuzzle(this, $(this).data('source'))
  })
}
$.fn.MathPuzzleVerify = verify
$.fn.parsePn = parsePn

const MathPuzzle = { makePuzzle: makePuzzle }

export default MathPuzzle
