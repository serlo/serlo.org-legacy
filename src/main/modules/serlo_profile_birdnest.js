import $ from 'jquery'
import d3 from 'd3'

var Birdnest, defaults

defaults = {
  stepwidth: 40,
  lineLength: 20,
  scalingMin: 10 * 40, // 10*stepwidth
  maxWidth: 150,
  maxHeight: 150,
  maxLines: 5000
}

Birdnest = function (options) {
  this.options = options
    ? $.extend({}, defaults, options)
    : $.extend({}, defaults)

  this.seed = {
    i: 0,
    x1: this.calcStart(
      { x: this.options.maxWidth / 2, y: this.options.maxHeight / 2 },
      0
    ).x,
    y1: this.calcStart(
      { x: this.options.maxWidth / 2, y: this.options.maxHeight / 2 },
      0
    ).y,
    x2: this.calcEnd(
      { x: this.options.maxWidth / 2, y: this.options.maxHeight / 2 },
      0
    ).x,
    y2: this.calcEnd(
      { x: this.options.maxWidth / 2, y: this.options.maxHeight / 2 },
      0
    ).y
  }
}

Birdnest.prototype.newLine = function (lastLine, total) {
  var scale = total > this.options.scalingMin ? total : this.options.scalingMin
  var middlePos = this.calcMiddle(lastLine, scale)
  var rotation = Math.random() * Math.PI
  var startPos = this.calcStart(middlePos, rotation)
  var endPos = this.calcEnd(middlePos, rotation)

  return {
    i: lastLine.i + 1,
    x1: startPos.x,
    y1: startPos.y,
    x2: endPos.x,
    y2: endPos.y
  }
}

Birdnest.prototype.calcMiddle = function (lastLine, scale) {
  var i = lastLine.i + 1
  var x =
    this.options.maxWidth / 2 +
    (Math.min(this.options.maxWidth, this.options.maxHeight) -
      this.options.lineLength) /
      2 *
      i *
      Math.cos(2 * Math.PI * i / this.options.stepwidth) /
      scale
  var y =
    this.options.maxHeight / 2 +
    (Math.min(this.options.maxWidth, this.options.maxHeight) -
      this.options.lineLength) /
      2 *
      i *
      Math.sin(2 * Math.PI * i / this.options.stepwidth) /
      scale

  return { x: x, y: y }
}

Birdnest.prototype.calcStart = function (middlePos, angle) {
  var x = middlePos.x + this.options.lineLength / 2 * Math.cos(angle)
  var y = middlePos.y + this.options.lineLength / 2 * Math.sin(angle)

  return { x: x, y: y }
}

Birdnest.prototype.calcEnd = function (middlePos, angle) {
  var x = middlePos.x + this.options.lineLength / 2 * Math.cos(angle + Math.PI)
  var y = middlePos.y + this.options.lineLength / 2 * Math.sin(angle + Math.PI)

  return { x: x, y: y }
}

Birdnest.prototype.createLines = function (counter) {
  var lines = []
  var line = this.seed
  var i

  for (i = 0; i < counter; i++) {
    lines.push(line)
    line = this.newLine(line, counter)
  }
  return lines
}

// D3 functions
function x1 (d) {
  return d.x1
}

function y1 (d) {
  return d.y1
}

function x2 (d) {
  return d.x2
}

function y2 (d) {
  return d.y2
}

function id (d) {
  return 'id-' + d.i
}

Birdnest.prototype.createSVG = function (lineCounter) {
  var lines = this.createLines(Math.min(lineCounter, this.options.maxLines))
  var svg = document.createElementNS(d3.ns.prefix.svg, 'svg')

  d3
    .select(svg)
    .attr('width', this.options.maxWidth)
    .attr('height', this.options.maxHeight)
    .selectAll('line')
    .data(lines)
    .enter()
    .append('line')
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
    .attr('id', id)
  return svg
}

$.fn.renderNest = function () {
  $(this).each(function () {
    var birdnest = new Birdnest({
      maxWidth: this.clientWidth
    })
    $(this)
      .empty()
      .append(birdnest.createSVG($(this).data('amount')))
  })
}
