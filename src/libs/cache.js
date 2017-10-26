import $ from 'jquery'
var cacheInstance
var usedStorage
var supports = {
  Storage: !!window.Storage,
  localStorage: !!window.localStorage,
  sessionStorage: !!window.sessionStorage,
  JSON: !!window.JSON,
  jQueryCookie: typeof $ === 'function' && typeof $.cookie === 'function'
}
/**
   * is the cache supposed to use JSON?
   *  defaults to true if JSON is available
   */
var useJSON = supports.JSON

/** FakeStorage
 *
 *   emulates basic behaviour for Storages
 *   - gets used, when there is no Storage available
 *   - uses jQuery.cookie if available
 */
function FakeStorage () {
  this.values = {}
}

FakeStorage.prototype.isFake = function () {
  return !supports.jQueryCookie
}

FakeStorage.prototype.setItem = function (key, value) {
  if (supports.jQueryCookie) {
    return $.cookie(key, value, {
      json: useJSON
    })
  }
  this.values[key] = value
  return value
}

FakeStorage.prototype.getItem = function (key) {
  if (supports.jQueryCookie) {
    return $.cookie(key, undefined, {
      json: useJSON
    })
  }
  return this.values[key] || null
}

FakeStorage.prototype.removeItem = function (key) {
  if (supports.jQueryCookie) {
    return $.removeCookie(key)
  }
  this.values[key] = undefined
  return true
}

FakeStorage.prototype.clear = function () {
  if (supports.jQueryCookie) {
    deleteAllCookies()
  } else {
    var key
    for (key in this.values) {
      if (this.values.hasOwnProperty(key)) {
        this.values[key] = null
      }
    }
  }
  return true
}

/* the Storage in use. Defaults to localStorage or FakeStorage */
usedStorage = supports.localStorage ? window.localStorage : new FakeStorage()

/***********
         *  Private available functions
         **********/

/** FN CacheInit
         *   returns the Cache itself
         */

function CacheInit () {
  return Cache
}

/**
         * decodes JSON
         */

function decodeData (data) {
  if (useJSON) {
    try {
      return JSON.parse(data)
    } catch (ignore) {
      console.log('aint no json')
    }
  }
  return data
}

/**
         * encodes JSON
         */

function encodeData (data) {
  if (useJSON) {
    try {
      return JSON.stringify(data)
    } catch (ignore) {}
  }
  return data
}

/** FN Cache
         *   returns all available actions on the given memorykey
         */

function Cache (memoryKey) {
  return Cache.prototype.functions(memoryKey)
}

/**
         *  memorize function
         */

function memorize (value) {
  /* jshint validthis:true */
  usedStorage.setItem(this.memoryKey, encodeData(value))
  return value
}

/**
         *  remember function
         */

function remember () {
  /* jshint validthis:true */
  var value = usedStorage.getItem(this.memoryKey)
  return decodeData(value)
}

/**
         *  forget function
         */

function forget () {
  /* jshint validthis:true */
  return usedStorage.removeItem(this.memoryKey)
}

/** prototype.functions
         *    returns an object of actions
         */

Cache.prototype.functions = function (memoryKey) {
  if (memoryKey === undefined) {
    throw new Error('No valid memory key given')
  }

  return {
    memoryKey: memoryKey,
    memorize: memorize,
    remember: remember,
    forget: forget
  }
}

/*
         * helper function to delete all javascript cookies
         * see http://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
         */

function deleteAllCookies () {
  var cookies = window.document.cookie.split(';')
  var i
  var length
  var cookie
  var eqPos
  var name

  for (i = 0, length = cookies.length; i < length; i += 1) {
    cookie = cookies[i]
    eqPos = cookie.indexOf('=')
    name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    window.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

/***********
         *  Public available functions
         **********/

/** FN runs
         *  returns false if Cache has no possibility to store any data
         */

Cache.runs = function () {
  return !(
    typeof usedStorage.isFake === 'function' && usedStorage.isFake() === true
  )
}

/** FN setStorage
         *  Sets the Storage Type, if it is supported
         *   "localStorage" || "sessionStorage"
         */

Cache.setStorage = function (storageType) {
  if (
    (storageType === 'localStorage' || storageType === 'sessionStorage') &&
    supports[storageType]
  ) {
    usedStorage = window[storageType]
    return true
  }
  return false
}

/**
         *  returns the current used storage
         */

Cache.getStorage = function () {
  return usedStorage
}

/**
         *  tells the cache to use JSON
         */

Cache.json = function () {
  useJSON = true
  return useJSON
}

/**
         *  tells the cache not to use JSON
         */

Cache.nojson = function () {
  useJSON = false
  return !useJSON
}

/**
         *  tells the cache, to go out, get drunk and forget about everything
         */

Cache.getDrunk = function () {
  return usedStorage.clear()
}

if (!cacheInstance) {
  cacheInstance = new CacheInit()
}

export default cacheInstance
