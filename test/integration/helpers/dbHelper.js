const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fixtures = require('../fixtures/index')
const auth = require('../../../src/utils/auth')
const prisma = new PrismaClient()

exports.findOrCreateUser = async ({ username, email, password }) => {
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
  await prisma.user.deleteMany()
  await prisma.post.deleteMany()
}

exports.loginAsTest = async () => {
  const user = await this.findOrCreateUser(fixtures.registerInput)
  const token = auth.generateToken(user.id)
  return { user, token }
}

