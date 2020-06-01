const { PrismaClient } = require('@prisma/client')
const { DbRepository } = require('./db/repository')
const auth = require('./utils/auth')
const utils = require('./utils/utils')

const prisma = new PrismaClient()

const context = {
  userRepository: new DbRepository(prisma.user, utils),
  postRepository: new DbRepository(prisma.post, utils),
  auth,
  utils
}

module.exports = context