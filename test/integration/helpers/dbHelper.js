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

/**
 * create many posts with the data, belonging to provided user.
 * you may get a user from loginAsTest or findOrCreateUser
 */
exports.createManyPosts = async (posts, user) => {
  const created = []
  for (let post of posts) {
    const response = this.createPost(post, user)
    created.push(response)
  }
  return created
}

exports.createPost = async (post, user) => {
  const response = await prisma.post.create({
    data: {
      ...post,
      user: { connect: { id: user.id } }
    }
  })
  return response
}

exports.createManyUsers = async (users = fixtures.users) => {
  const created = []
  for (let user of users) {
    const response = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, 10)
      }
    })
    created.push(response)
  }
  return created
}

