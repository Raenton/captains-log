exports.registerUser = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { username, email, password } = args.registerInput

  const passwordHash = await auth.hashPassword(password)
  const user = await prisma.user.create({
    data: { username, email, passwordHash }
  })
  const token = auth.generateToken(user.id)

  return { token, user }
}

exports.login = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { email, password } = args.loginInput

  const user = await prisma.user.findOne({
    where: { email }
  })

  if (!user) {
    throw new Error('User does not exist')
  }

  const isPasswordValid = await auth.checkPassword(password, user.passwordHash)
  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }

  const token = auth.generateToken(user.id)

  return { token, user }
}
