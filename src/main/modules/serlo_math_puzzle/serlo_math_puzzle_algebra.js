/**
 *
 * Interactive Mathematical Puzzles
 * Check validity of algebraic answers
 *
 * @author  Stefan Dirnstorfer
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 */

// Exactract the formula for the user created value.
function computePn (obj) {
  var atom, list, op, i, sub;

  atom= obj.getAttribute('data-atom');
  if (atom)
    return atom;

  list = [];
  op = obj.getAttribute('data-operator');
  if (op)
    list.push(op)

  // recurse through child elements to find open arguments
  for (i = 0; i < obj.childNodes.length; ++i) {
    if (obj.childNodes[i].nodeType === 1) {
      // if the child node has a value, compute it and
      // store in the argument list.
      sub = computePn(obj.childNodes[i])
      if (sub) {
        list.push(sub)
      }
    }
  }
  if (list.length == 0 && obj.getAttribute('class')=='operand')
    return '#'
  return op ? list : list[0];
}

// verify whether the new object satisfies the winning test
function verify (svg) {
  // extract the user created formula in json
  var goal, pass
  var obj = svg.querySelector('[data-goal]')

  // construct the objective function
  goal = obj.goal
  pass = isEquivalent(obj, goal)
  smile(svg, pass)
  return pass
}

function isEquivalent(value, goal) {
  var valueAst, goalAst, i, data, value1, value2, getVar, nonnan
  valueAst= computePn(value)
  goalAst= goal
  nonnan= false
  for (i = 0; i < 10; ++i) {
    data= {}
    getVar= function(x) {
      if (data[x]===undefined)
        data[x]=Math.random() * 6 - 3
      return data[x]
    }
    value1 = evalPn(valueAst, getVar)
    value2 = evalPn(goalAst, getVar)
    if (isNaN(value1) !== isNaN(value2)) return false
    if (!isNaN(value1)) {
      nonnan= true
      if (Math.abs(value1 - value2) > 1e-10) return false
    }
  }
  return nonnan;
}

// sets the oppacitiy to show either of the two similies
function smile (svg, win) {
  var oldstyle = svg.parentNode.getAttribute('class')
  var newstyle = oldstyle.replace(/ solved/, '')
  if (win) newstyle = newstyle + ' solved'
  svg.parentNode.setAttribute('class', newstyle)
}

function evalPn(structure, getVar) {
  if (structure.constructor===Array) {
    switch (structure[0]) {
      case '/': return evalPn(structure[1],getVar)/evalPn(structure[2],getVar)
      case '+': return evalPn(structure[1],getVar)+evalPn(structure[2],getVar)
      case '-': return evalPn(structure[1],getVar)-evalPn(structure[2],getVar)
      case '*': return evalPn(structure[1],getVar)*evalPn(structure[2],getVar)
      case '^': return Math.pow(evalPn(structure[1],getVar),evalPn(structure[2],getVar))
    }
  }
  else if (structure=='#')
    return 0/0
  else if (structure.match(/^\$/)) {
    return getVar(structure.substring(1))
  }
  else {
    return parseFloat(structure);
  }
}

const Algebra = {
  verify: verify
}
export default Algebra
