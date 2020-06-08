const { PrismaClient } = require('@prisma/client')
const { DbRepository } = require('./db/repository')
const auth = require('./utils/auth')
const utils = require('./utils/utils')

const createContext = () => {
  const prisma = new PrismaClient({
    errorFormat: 'minimal'
  })
  
  const context = {
    _prisma: prisma,
    userRepository: new DbRepository(prisma.user, utils),
    postRepository: new DbRepository(prisma.post, utils),
    auth,
    utils
  }

  return context
}

module.exports = { createContext }

