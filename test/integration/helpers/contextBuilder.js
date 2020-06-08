const { createContext } = require('../../../src/context')

const buildContext = (append) => ({
  ...createContext(),
  ...append
})

module.exports = { buildContext }
