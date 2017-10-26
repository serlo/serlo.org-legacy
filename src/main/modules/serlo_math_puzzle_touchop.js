import algebra from './serlo_math_puzzle_algebra'

// setup event listeners for the svg canvas
function setupCanvas (svgElement) {
  // DnD frame work
  // hand is a reference to the object currently beeing dragged.
  var hand = null
  // The screen coordinates of the last drag update.
  var startPos = [0, 0]
  var justGrabbed = false
  // position for long click action, after which the top group is selected
  var longClick = [0, 0]

  svgElement.parentNode.addEventListener('mousemove', msMove)
  svgElement.parentNode.addEventListener('touchmove', msMove)
  svgElement.parentNode.addEventListener('mouseup', msUp)
  svgElement.parentNode.addEventListener('touchend', msUp)
  svgElement.addEventListener('mousedown', msBlur)
  svgElement.addEventListener('touchstart', msBlur)
  setupCloneables(svgElement)
  deepLayout(svgElement, true)

  // setup cloneable elements from palette
  function setupCloneables (svgElement) {
    var i
    var paletteEntries = svgElement.querySelectorAll('.cloneme')

    for (i = 0; i < paletteEntries.length; ++i) {
      paletteEntries[i].addEventListener('mousedown', duplicateElement)
      paletteEntries[i].addEventListener('touchstart', duplicateElement)
    }
  }

  // setup event listeners for an element. This function is called
  // when an element is moved out of the palette
  function duplicateElement (grabEvent) {
    var operands
    var i
    var elt = grabEvent.currentTarget.firstChild
    var copy = elt.cloneNode(true)

    elt.parentNode.appendChild(copy)

    elt.addEventListener('mousedown', msDown)
    elt.addEventListener('touchstart', msDown)
    operands = elt.querySelectorAll('.operand')
    for (i = 0; i < operands.length; ++i) {
      operands[i].removeAttribute('blocked')
    }
    if (grabEvent) {
      elt.setAttribute('opacity', 0.5)
      justGrabbed = true
      sendHome(elt)
      if (navigator.vibrate) navigator.vibrate(10)
      msDown(grabEvent)
    }
  }

  // Perform an initial layout of all objects on the screen.
  function deepLayout (obj, doFloat) {
    var isObj, i, m, box
    if (obj.nodeType === 1 && obj.getAttribute('display') !== 'none') {
      // layout children
      isObj = obj.getAttribute('data-ismovable')
      for (i = 0; i < obj.childNodes.length; ++i) {
        deepLayout(obj.childNodes[i], isObj === '' && doFloat)
      }
      // call layout function if available
      innerLayout(obj)

      // set Floating
      setFloating(obj, doFloat)
      if (doFloat && isObj) {
        box = obj.getBBox()
        m = getTransformToElement(obj, obj.parentNode)
        m = m.translate(-box.x, -box.y)
        setTransform(obj, m)
      }
    }
  }

  // Translate events that come from touch devices
  function translateTouch (evt) {
    if (evt.touches) {
      var evt2 = {}
      evt2.clientX = evt.touches[0].clientX
      evt2.clientY = evt.touches[0].clientY
      evt2.target = document.elementFromPoint(evt2.clientX, evt2.clientY)
      evt2.isTouch = true
      evt.preventDefault()
      return evt2
    }
    // not a touch device
    return evt
  }

  // msDown is called whenever the mouse button is pressed anywhere on the root document.
  function msDown (evt0) {
    var evt = translateTouch(evt0)
    var grabbed = evt.target

    if (!hand && evt.target) {
      // find signaling object
      while (grabbed.getAttribute('data-ismovable') !== 'true') {
        grabbed = grabbed.parentNode
      }
      hand = grabbed
      svgElement.classList.add('grabbed')

      // store mouse position. Will be updated when mouse moves.
      startPos = [evt.clientX, evt.clientY]

      // mark root after time out
      initLongClick(evt.clientX, evt.clientY)
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur()
      }
    }
  }

  // Mouse clicked on the background
  function msBlur (evt) {
    if (!evt.touches) evt.preventDefault()
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur()
    }
    return false
  }

  // This function is called when the mouse button is released.
  function msUp () {
    if (hand) {
      hand.removeAttribute('pointer-events')
      if (hand.getAttribute('opacity')) {
        var parent = hand.parentNode
        parent.removeChild(hand)
        layout(parent)
      }
      hand = null
      svgElement.classList.remove('grabbed')
    }
    justGrabbed = false
  }

  // Move the grabbed object "hand" with the mouse
  function msMove (evt0) {
    if (hand) {
      // compute relative mouse movements since last call
      var dropTo
      var current
      var isTop
      var thresh
      var m
      var evt = translateTouch(evt0)
      var dx = evt.clientX - startPos[0]
      var dy = evt.clientY - startPos[1]
      var dist = Math.max(
        Math.abs(dx / hand.getScreenCTM().a),
        Math.abs(dy / hand.getScreenCTM().d)
      )

      // long click action
      initLongClick(evt.clientX, evt.clientY)
      if (isNaN(startPos[0])) {
        startPos = [evt.clientX, evt.clientY]
        return
      }

      // check if object can be dropped
      current = evt.target
      while (current.nodeType === 1) {
        if (
          current.getAttribute('class') === 'operand' &&
          (current.getAttribute('blocked') !== 'true' ||
            current === hand.parentNode)
        ) {
          dropTo = current
        }
        if (current.getAttribute('class') === 'palette') {
          hand.setAttribute('opacity', 0.5)
        }
        if (current === hand) dropTo = undefined
        current = current.parentNode
      }
      if (dropTo) {
        // offset snap region
        if (dropTo !== hand.parentNode) startPos = [evt.clientX, evt.clientY]

        // insert grabbed object into mouse pointer target group
        setFloating(hand, false)
        hand.removeAttribute('opacity')
        moveToGroup(hand, dropTo, evt.clientX, evt.clientY)
      } else if (dropTo !== hand.parentNode) {
        // object can not be dropped let it move
        isTop = hand.parentNode === svgElement
        thresh = justGrabbed ? 100 : 30
        if (isTop || dist > thresh) {
          // make underlying objects receive mouse events.
          sendHome(hand)
          hand.setAttribute('pointer-events', 'none')
          if (justGrabbed) hand.setAttribute('opacity', 0.5)

          // switch to screen coordinate system
          m = hand.parentNode.getScreenCTM().inverse()
          // translate by screen coordinates
          m = m.translate(dx, dy)
          // transform bock to local coordinate system
          m = m.multiply(hand.getScreenCTM())
          // apply transformation
          setTransform(hand, m)

          // offset snap region
          startPos = [evt.clientX, evt.clientY]
        }
      }
    }
  }

  // The object obj is inserted into a new group element target. Layouts are updated
  function moveToGroup (obj, target, x, y) {
    // move object from its current to the target container
    var m
    var p
    var oldContainer = obj.parentNode

    try {
      target.appendChild(obj)
    } catch (e) {
      // ignore circular insertion due to event race
      layout(obj)
      return
    }

    // default position at the cursor
    if (target.getAttribute('data-container') === 'true') {
      m = obj.getScreenCTM()
      p = target.getScreenCTM().inverse()
      m.e = x
      m.f = y
      setTransform(obj, p.multiply(m))
    }

    // layout old and new container
    if (oldContainer !== target) {
      setTimeout(function () {
        layout(oldContainer)
      }, 1)
      innerLayout(obj)
      layout(target)
    }

    algebra.verify(svgElement)
  }

  // This method is called when an object is draged on the background.
  // The draged object is inserted into its home group and the transformation is adjusted
  function sendHome (obj) {
    // move this object to the root element
    var m, m1, m2
    if (obj.parentNode !== svgElement) {
      // store the current location
      m1 = svgElement.getScreenCTM().inverse()
      m2 = obj.getScreenCTM()

      // the object is inserted into its home group
      moveToGroup(obj, svgElement)

      // compute relative transformation matrix
      m = obj.getScreenCTM()
      m.e = m2.e
      m.f = m2.f
      m = m1.multiply(m)

      // update transformation
      setTransform(obj, m)
      layout(obj)
      setFloating(obj, true)
    }
    // make the object float on top
    if (obj !== svgElement.lastChild) svgElement.appendChild(obj)
  }

  // Transform element and all containing groups to hold new content
  function layout (element) {
    var ctm2
    var w
    var m
    var obj = element
    var top = null
    var ctm1 = obj.getCTM()

    do {
      innerLayout(obj)
      if (obj.getAttribute('data-layout')) {
        top = obj
      }
      obj = obj.parentNode
    } while (obj.nodeType === 1)

    // If the topmost element is freely placeable, realign it
    if (top && top.getAttribute('data-ismovable') === 'true') {
      // make sure original element does not move on the screen
      ctm2 = element.getCTM()
      w = top.getCTM()
      m = getTransformToElement(top, top.parentNode)
      m = m.multiply(w.inverse())
      m = m.translate(ctm1.e - ctm2.e, ctm1.f - ctm2.f)
      m = m.multiply(w)
      setTransform(top, m)
      setFloating(top, true)
    }
  }

  // call the referenced layout function in the data-layout attribute
  function innerLayout (element) {
    switch (element.getAttribute('data-layout')) {
      case 'paletteLayout':
        paletteLayout(element)
        break
      case 'horizontalLayout':
        horizontalLayout(element)
        break
      case 'verticalLayout':
        verticalLayout(element)
        break
      case 'snap':
        snap(element)
        break
    }
  }

  // this function inserts parenthesis to ensure syntactic correctness
  function insertParenthesis (obj) {
    // check if object has priority attribute
    var child
    var next
    var subPrio
    var lpar
    var rpar
    var cbox
    var parbox
    var scale
    var myPrio = obj.getAttribute('data-priority')

    if (myPrio) {
      // myPrio is the operations priority
      myPrio = parseInt(myPrio, 10)
      if ((myPrio & 1) === 1) myPrio = myPrio - 1
      child = obj.firstChild
      // check each child if parenthesis are needed
      while (child) {
        next = child.nextSibling
        if (child.nodeType === 1) {
          // prevailing parenthesis are removed
          if (child.getAttribute('name') === 'parenthesis') {
            obj.removeChild(child)
          } else {
            // check if child's priority requires placing parethesis
            subPrio = getPriority(child)
            if (myPrio < subPrio) {
              // create new parenthesis objects
              lpar = document.createElementNS(obj.namespaceURI, 'text')
              lpar.appendChild(document.createTextNode('('))
              lpar.setAttribute('name', 'parenthesis')
              obj.insertBefore(lpar, child)
              rpar = document.createElementNS(obj.namespaceURI, 'text')
              rpar.appendChild(document.createTextNode(')'))
              rpar.setAttribute('name', 'parenthesis')
              obj.insertBefore(rpar, child.nextSibling)

              // scale the parenthesis to full height
              cbox = child.getBBox()
              parbox = lpar.getBBox()
              scale = cbox.height / parbox.height
              lpar.setAttribute('transform', 'scale(1,' + scale + ')')
              rpar.setAttribute('transform', 'scale(1,' + scale + ')')
            }
          }
        }
        // proceed to the next child
        child = next
      }
    }
  }

  // get an operator's mathematical priority to determine
  // whether parenthesis are required.
  function getPriority (obj) {
    var i
    var child
    var prio = obj.getAttribute('data-priority')

    if (prio) {
      return parseInt(prio, 10)
    } else {
      for (i = 0; i < obj.childNodes.length; ++i) {
        child = obj.childNodes[i]
        if (child.nodeType === 1) {
          prio = getPriority(child)
          if (prio !== 0) return prio
        }
      }
    }
    return 0
  }

  // Layouts the content centered to its first child element
  // Creates a snap-in like effect what dropping operands
  function snap (obj) {
    var child
    var m
    var box1
    var box2
    var i
    var back = null
    var blocked = false

    for (i = 0; i < obj.childNodes.length; ++i) {
      child = obj.childNodes[i]
      if (child.nodeType === 1) {
        if (child.getAttribute('class') === 'background') {
          // The first element is the reference position
          back = child
          back.removeAttribute('opacity')
        } else if (back) {
          m = getTransformToElement(child, obj)
          box1 = back.getBBox()
          box2 = child.getBBox()

          m.e = box1.x - box2.x - 0.5 * box2.width + 0.5 * box1.width
          m.f = box1.y - box2.y - 0.5 * box2.height + 0.5 * box1.height
          setTransform(child, m)

          // make drop area opaque
          back.setAttribute('opacity', '0.0')

          if (child.getAttribute('data-ismovable') === 'true') blocked = true
        }
      }
    }
    if (blocked) {
      obj.setAttribute('blocked', 'true')
    } else {
      obj.removeAttribute('blocked')
    }
    // vibrate
    if (hand && navigator.vibrate) navigator.vibrate(10)
  }

  // Layouts all child objects horizontally.
  function horizontalLayout (obj) {
    insertParenthesis(obj)
    boxLayout(obj, true)
  }

  // Layouts all child objects horizontally.
  function verticalLayout (obj) {
    boxLayout(obj, false)
  }

  // Layouts all child objects sequentially in one axis,
  // centered in the other axis.
  function boxLayout (obj, horizontal) {
    var padding = 5
    var back = null
    var stretch = null
    var x = 0
    var x0 = 0
    var y = 0
    var h = 0
    var child
    var opt
    var m
    var box
    var i

    if (obj.getAttribute('data-padding')) {
      padding = parseInt(obj.getAttribute('data-padding'), 10)
    }

    for (i = 0; i < obj.childNodes.length; ++i) {
      child = obj.childNodes[i]
      if (child.nodeType === 1) {
        opt = child.getAttribute('data-layoutOpt')
        if (child.getAttribute('class') === 'background') {
          back = child
        } else if (
          back &&
          child.getAttribute('display') !== 'none' &&
          child.transform
        ) {
          // find local coordinate system
          m = getTransformToElement(child, obj)
          box = child.getBBox()

          if (opt === 'stretch') {
            // determine the objects size later
            m.a = 1.0
            m.d = 1.0
            stretch = child
          }

          // align object
          if (horizontal) {
            m.e = x - m.a * box.x
            m.f =
              y -
              m.d * (box.y + 0.5 * box.height) -
              m.b * (box.x + 0.5 * box.width)
          } else {
            m.e =
              y -
              m.a * (box.x + 0.5 * box.width) -
              m.c * (box.y + 0.5 * box.height)
            m.f = x - m.d * box.y - Math.min(m.d, 0) * box.height
          }
          setTransform(child, m)

          // compute position for next element
          if (horizontal) {
            x += +m.a * box.width + padding
            h = Math.max(h, Math.abs(m.d) * box.height)
          } else {
            x += m.d * box.height + padding
            h = Math.max(
              h,
              Math.abs(m.a) * box.width + Math.abs(m.c) * box.height
            )
          }
        }
      }
    }

    // strech object to span from left to right
    if (stretch) {
      h = h + 10
      box = stretch.getBBox()
      m = getTransformToElement(stretch, obj)
      m.a = h / box.width
      m.e = m.e + (1 - m.a) * (box.x + box.width / 2)
      setTransform(stretch, m)
    }

    // scale the background to cover the object's area
    h = h + 2 * padding
    if (back) {
      if (horizontal) scaleRect(back, x0 - padding, x, y - h / 2, y + h / 2)
      else scaleRect(back, y - h / 2, y + h / 2, x0 - padding, x)
    }
  }

  function paletteLayout (obj) {
    var child
    var m
    var box
    var operands
    var i
    var x = 10

    for (i = 0; i < obj.childNodes.length; ++i) {
      child = obj.childNodes[i]
      if (child.nodeType === 1 && child.nodeName === 'g') {
        // find local coordinate system
        m = getTransformToElement(child, obj)
        box = child.getBBox()

        m.a = m.d = 50 / (0.1 + box.height)
        m.e = x - m.a * box.x
        m.f = 10 - box.y * m.a
        setTransform(child, m)

        // compute position for next element
        x += +m.a * box.width + 10
      }
    }
    operands = obj.querySelectorAll('.operand')
    for (i = 0; i < operands.length; ++i) {
      operands[i].setAttribute('blocked', 'true')
    }
  }

  // Set the boundaries for the background rectangular element
  function scaleRect (obj, x0, x1, y0, y1) {
    obj.setAttribute('width', x1 - x0)
    obj.setAttribute('height', y1 - y0)
    obj.setAttribute('x', x0)
    obj.setAttribute('y', y0)
  }

  // Makes or removes a shadow below movable objects
  function setFloating (obj, doFloat) {
    var oldShadow
    var shadow
    var back
    var canMove = obj.getAttribute('data-ismovable') === 'true'

    if (canMove) {
      // the shadow is always the first child
      oldShadow = obj.childNodes[0]
      if (
        oldShadow.nodeType === 1 &&
        oldShadow.getAttribute('class') === 'shadow'
      ) {
        obj.removeChild(oldShadow)
      }
      // find the objects background element
      back = obj.childNodes[0]
      while (
        back &&
        (back.nodeType !== 1 || back.getAttribute('class') !== 'background')
      ) {
        back = back.nextSibling
      }
      // create the shadow element by cloning the background
      if (doFloat && back) {
        shadow = back.cloneNode(false)
        obj.insertBefore(shadow, obj.childNodes[0])
        shadow.setAttribute('class', 'shadow')
        shadow.setAttribute('transform', 'translate(3,5)')
      }
    }
  }

  // select root expression after 500ms stable click on sub expression
  function initLongClick (x, y) {
    longClick = [x, y]
    setTimeout(function () {
      longClickAction(x, y)
    }, 500)
  }

  // select the root element in case of long clicks
  function longClickAction (x, y) {
    if (
      hand &&
      !justGrabbed &&
      Math.abs(x - longClick[0]) + Math.abs(y - longClick[1]) < 5
    ) {
      var root = findRoot(hand)
      hand.removeAttribute('pointer-events')
      hand = root
    }
  }
}

// find the largest moveable group in which obj is contained
function findRoot (obj) {
  var root = obj
  while (obj && obj.nodeType === 1) {
    if (obj.getAttribute('data-ismovable') === 'true') root = obj
    obj = obj.parentNode
  }
  return root
}

// Applys the transformation matrix m to the SVG element obj
function setTransform (obj, m) {
  // For some very strange reasons conversion to string is 2x faster.
  obj.setAttribute(
    'transform',
    'matrix(' +
      m.a +
      ',' +
      m.b +
      ',' +
      m.c +
      ',' +
      m.d +
      ',' +
      m.e +
      ',' +
      m.f +
      ')'
  )
}

// Replacement for the deprecated function
function getTransformToElement (obj, target) {
  return target
    .getScreenCTM()
    .inverse()
    .multiply(obj.getScreenCTM())
}

const TouchOp = {
  setupCanvas: setupCanvas
}

export default TouchOp
