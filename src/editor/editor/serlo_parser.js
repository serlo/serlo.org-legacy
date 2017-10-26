var Parser = function () {}

Parser.prototype.setConverter = function (converter, convertFunctionName) {
  this.converter = function (value) {
    return converter[convertFunctionName](value)
  }
}

Parser.prototype.parse = function (value) {
  return this.converter ? this.converter(value) : value
}

export default Parser
