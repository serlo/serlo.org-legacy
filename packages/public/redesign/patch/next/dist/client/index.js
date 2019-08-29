'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.render = render
exports.renderError = renderError
exports.default = exports.emitter = exports.ErrorComponent = exports.router = exports.dataManager = void 0

var _react = _interopRequireWildcard(require('react'))

var _reactDom = _interopRequireDefault(require('react-dom'))

var _headManager = _interopRequireDefault(
  require('next/dist/client/head-manager')
)

var _router2 = require('next/router')

var _mitt = _interopRequireDefault(require('next-server/dist/lib/mitt'))

var _utils = require('next-server/dist/lib/utils')

var _pageLoader = _interopRequireDefault(
  require('next/dist/client/page-loader')
)

var envConfig = _interopRequireWildcard(require('next-server/config'))

var _loadable = _interopRequireDefault(require('next-server/dist/lib/loadable'))

var _headManagerContext = require('next-server/dist/lib/head-manager-context')

var _dataManagerContext = require('next-server/dist/lib/data-manager-context')

var _routerContext = require('next-server/dist/lib/router-context')

var _dataManager = require('next-server/dist/lib/data-manager')

var _querystring = require('querystring')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj
  } else {
    var newObj = {}
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {}
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc)
          } else {
            newObj[key] = obj[key]
          }
        }
      }
    }
    newObj.default = obj
    return newObj
  }
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== 'undefined' &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left)
  } else {
    return left instanceof right
  }
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call
  }
  return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return self
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }
  return _setPrototypeOf(o, p)
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit(arr, i) {
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

// Polyfill Promise globally
// This is needed because Webpack's dynamic loading(common chunks) code
// depends on Promise.
// So, we need to polyfill it.
// See: https://webpack.js.org/guides/code-splitting/#dynamic-imports
if (!window.Promise) {
  window.Promise = Promise
}

var data = JSON.parse(
  document.getElementById(
    '__NEXT_DATA__' + (window.NEXT_ROOTS ? window.NEXT_ROOTS[0] : '')
  ).textContent
)
window.__NEXT_DATA__ = data
var props = data.props,
  err = data.err,
  page = data.page,
  query = data.query,
  buildId = data.buildId,
  dynamicBuildId = data.dynamicBuildId,
  assetPrefix = data.assetPrefix,
  runtimeConfig = data.runtimeConfig,
  dynamicIds = data.dynamicIds
var d = JSON.parse(window.__NEXT_DATA__.dataManager)
var dataManager = new _dataManager.DataManager(d)
exports.dataManager = dataManager
var prefix = assetPrefix || '' // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime

__webpack_public_path__ = ''.concat(prefix, '/_next/') //eslint-disable-line
// Initialize next/config with the environment configuration

envConfig.setConfig({
  serverRuntimeConfig: {},
  publicRuntimeConfig: runtimeConfig
})
var asPath = (0, _utils.getURL)()
var pageLoader = new _pageLoader.default(buildId, prefix)

var register = function register(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
    r = _ref2[0],
    f = _ref2[1]

  return pageLoader.registerPage(r, f)
}

if (window.__NEXT_P) {
  window.__NEXT_P.map(register)
}

window.__NEXT_P = []
window.__NEXT_P.push = register
var headManager = new _headManager.default()
var appContainer = document.getElementById('__next')
var lastAppProps
var webpackHMR
var router
exports.router = router
var ErrorComponent
exports.ErrorComponent = ErrorComponent
var Component
var App

var Container =
  /*#__PURE__*/
  (function(_React$Component) {
    _inherits(Container, _React$Component)

    function Container() {
      _classCallCheck(this, Container)

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(Container).apply(this, arguments)
      )
    }

    _createClass(Container, [
      {
        key: 'componentDidCatch',
        value: function componentDidCatch(err, info) {
          this.props.fn(err, info)
        }
      },
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.scrollToHash() // If page was exported and has a querystring
          // If it's a dynamic route (/$ inside) or has a querystring

          if (
            data.nextExport &&
            (router.pathname.indexOf('/$') !== -1 || window.location.search)
          ) {
            // update query on mount for exported pages
            router.replace(
              router.pathname +
                '?' +
                (0, _querystring.stringify)({
                  ...router.query,
                  ...(0, _querystring.parse)(window.location.search.substr(1))
                }),
              asPath
            )
          }
        }
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          this.scrollToHash()
        }
      },
      {
        key: 'scrollToHash',
        value: function scrollToHash() {
          var hash = window.location.hash
          hash = hash && hash.substring(1)
          if (!hash) return
          var el = document.getElementById(hash)
          if (!el) return // If we call scrollIntoView() in here without a setTimeout
          // it won't scroll properly.

          setTimeout(function() {
            return el.scrollIntoView()
          }, 0)
        }
      },
      {
        key: 'render',
        value: function render() {
          return this.props.children
        }
      }
    ])

    return Container
  })(_react.default.Component)

var emitter = (0, _mitt.default)()
exports.emitter = emitter

var _default = async function _default() {
  var _ref3 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    passedWebpackHMR = _ref3.webpackHMR

  // This makes sure this specific lines are removed in production
  if (process.env.NODE_ENV === 'development') {
    webpackHMR = passedWebpackHMR
  }

  App = await pageLoader.loadPage('/_app')
  var initialErr = err
  var components = {}

  try {
    if (!window.NEXT_ROOTS) {
      Component = await pageLoader.loadPage(page)
    } else {
      var _iteratorNormalCompletion = true
      var _didIteratorError = false
      var _iteratorError = undefined

      try {
        for (
          var _iterator = window.NEXT_ROOTS[Symbol.iterator](), _step;
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = true
        ) {
          var id = _step.value
          var component = await pageLoader.loadPage(id)
          components[id] = component
        }
      } catch (err) {
        _didIteratorError = true
        _iteratorError = err
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return()
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError
          }
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      var _require = require('react-is'),
        isValidElementType = _require.isValidElementType

      if (!isValidElementType(Component)) {
        throw new Error(
          'The default export is not a React Component in page: "'.concat(
            page,
            '"'
          )
        )
      }
    }
  } catch (error) {
    // This catches errors like throwing in the top level of a module
    initialErr = error
  }

  await _loadable.default.preloadReady(dynamicIds || [])

  if (dynamicBuildId === true) {
    pageLoader.onDynamicBuildId()
  }

  exports.router = router = (0, _router2.createRouter)(page, query, asPath, {
    initialProps: props,
    pageLoader: pageLoader,
    App: App,
    Component: Component,
    err: initialErr,
    subscription: function subscription(_ref4, App) {
      var Component = _ref4.Component,
        props = _ref4.props,
        err = _ref4.err
      render({
        App: App,
        Component: Component,
        props: props,
        err: err,
        emitter: emitter
      })
    }
  })

  if (!window.NEXT_ROOTS) {
    render({
      App: App,
      Component: Component,
      props: props,
      err: initialErr,
      emitter: emitter
    })
  } else {
    for (var _page in components) {
      var pageProps = JSON.parse(
        document.getElementById('__NEXT_DATA__' + _page).textContent
      ).props
      render({
        App: App,
        page: _page,
        Component: components[_page],
        props: pageProps,
        err: initialErr,
        emitter: emitter
      })
    }
  }

  return emitter
}

exports.default = _default

async function render(props) {
  if (props.err) {
    await renderError(props)
    return
  }

  try {
    await doRender(props)
  } catch (err) {
    await renderError({ ...props, err: err })
  }
} // This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.

async function renderError(props) {
  var App = props.App,
    err = props.err

  if (process.env.NODE_ENV !== 'production') {
    return webpackHMR.reportRuntimeError(webpackHMR.prepareError(err))
  } // Make sure we log the error to the console, otherwise users can't track down issues.

  console.error(err)
  exports.ErrorComponent = ErrorComponent = await pageLoader.loadPage('/_error') // In production we do a normal render with the `ErrorComponent` as component.
  // If we've gotten here upon initial render, we can use the props from the server.
  // Otherwise, we need to call `getInitialProps` on `App` before mounting.

  var initProps = props.props
    ? props.props
    : await (0, _utils.loadGetInitialProps)(App, {
        Component: ErrorComponent,
        router: router,
        ctx: {
          err: err,
          pathname: page,
          query: query,
          asPath: asPath
        }
      })
  await doRender({
    ...props,
    err: err,
    Component: ErrorComponent,
    props: initProps
  })
} // If hydrate does not exist, eg in preact.

var isInitialRender = typeof _reactDom.default.hydrate === 'function'

function renderReactElement(reactEl, domEl) {
  // The check for `.hydrate` is there to support React alternatives like preact
  if (isInitialRender) {
    _reactDom.default.hydrate(reactEl, domEl)

    isInitialRender = false
  } else {
    _reactDom.default.render(reactEl, domEl)
  }
}

async function doRender(_ref5) {
  var App = _ref5.App,
    Component = _ref5.Component,
    props = _ref5.props,
    page = _ref5.page,
    err = _ref5.err

  // Usual getInitialProps fetching is handled in next/router
  // this is for when ErrorComponent gets replaced by Component by HMR
  if (
    !props &&
    Component &&
    Component !== ErrorComponent &&
    lastAppProps.Component === ErrorComponent
  ) {
    var _router = router,
      pathname = _router.pathname,
      _query = _router.query,
      _asPath = _router.asPath
    props = await (0, _utils.loadGetInitialProps)(App, {
      Component: Component,
      router: router,
      ctx: {
        err: err,
        pathname: pathname,
        query: _query,
        asPath: _asPath
      }
    })
  }

  Component = Component || lastAppProps.Component
  props = props || lastAppProps.props
  var appProps = {
    Component: Component,
    err: err,
    router: router,
    ...props
  } // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.

  lastAppProps = appProps
  emitter.emit('before-reactdom-render', {
    Component: Component,
    ErrorComponent: ErrorComponent,
    appProps: appProps
  }) // In development runtime errors are caught by react-error-overlay.

  if (process.env.NODE_ENV === 'development') {
    renderReactElement(
      _react.default.createElement(
        Container,
        {
          fn: function fn(error) {
            return renderError({
              App: App,
              err: error
            }).catch(function(err) {
              return console.error('Error rendering page: ', err)
            })
          }
        },
        _react.default.createElement(
          _react.Suspense,
          {
            fallback: _react.default.createElement('div', null, 'Loading...')
          },
          _react.default.createElement(
            _routerContext.RouterContext.Provider,
            {
              value: (0, _router2.makePublicRouterInstance)(router)
            },
            _react.default.createElement(
              _dataManagerContext.DataManagerContext.Provider,
              {
                value: dataManager
              },
              _react.default.createElement(
                _headManagerContext.HeadManagerContext.Provider,
                {
                  value: headManager.updateHead
                },
                _react.default.createElement(App, appProps)
              )
            )
          )
        )
      ),
      appContainer
    )
  } else {
    // In production we catch runtime errors using componentDidCatch which will trigger renderError.
    renderReactElement(
      _react.default.createElement(
        Container,
        {
          fn: function fn(error) {
            return renderError({
              App: App,
              err: error
            }).catch(function(err) {
              return console.error('Error rendering page: ', err)
            })
          }
        },
        _react.default.createElement(
          _react.Suspense,
          {
            fallback: _react.default.createElement('div', null, 'Loading...')
          },
          _react.default.createElement(
            _routerContext.RouterContext.Provider,
            {
              value: (0, _router2.makePublicRouterInstance)(router)
            },
            _react.default.createElement(
              _dataManagerContext.DataManagerContext.Provider,
              {
                value: dataManager
              },
              _react.default.createElement(
                _headManagerContext.HeadManagerContext.Provider,
                {
                  value: headManager.updateHead
                },
                _react.default.createElement(App, appProps)
              )
            )
          )
        )
      ),
      document.getElementById('__next' + page)
    )
  }

  emitter.emit('after-reactdom-render', {
    Component: Component,
    ErrorComponent: ErrorComponent,
    appProps: appProps
  })
}
