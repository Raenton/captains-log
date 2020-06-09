const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fixtures = require('../fixtures/index')
const auth = require('../../../src/utils/auth')
const prisma = new PrismaClient()

/**
 * you can emit parameters to create a default test user.
 * will create user if it doesn't exist.
 */
exports.findOrCreateUser = async ({ username, email, password } = fixtures.registerInput) => {
  const user = await prisma.user.findOne({ where: { email }})
  if (user) {
    return user
  }

  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { username, email, passwordHash }
  })
}

exports.clear = async () => {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
}

/**
 * you can emit parameters to login as a default test user.
 */
exports.loginAsTest = async (args) => {
  const user = await this.findOrCreateUser(args)
  const token = auth.generateToken(user.id)
  return { user, token }
}

