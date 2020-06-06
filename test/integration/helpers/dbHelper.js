const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
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
