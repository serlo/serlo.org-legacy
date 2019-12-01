function setTimeout(seconds) {
  jest.setTimeout(seconds * 1000)
}

setTimeout(60)
