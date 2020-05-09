exports.registerUser = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { username, email, password } = args.registerInput

  const passwordHash = await auth.hashPassword(password)
  const user = await prisma.createUser({ username, email, passwordHash })
  const token = auth.generateToken(user.id)

  return { token, user }
}

exports.login = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { email, password } = args.loginInput

  const user = await prisma.user({ email })

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

exports.post = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { title, body, description } = args.postInput

  const userId = auth.authenticate(context)
  const post = await prisma.createPost({
    title,
    body,
    description,
    user: { connect: { id: userId }}
  })
  return post
}

exports.like = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { postId } = args
  const userId = auth.authenticate(context)

  const likeWhere = {
    user: { id: userId },
    post: { id: postId }
  }

  const likeExists = await prisma.$exists.like(likeWhere)

  if (likeExists) {
    const likeMatches = await prisma.post({ id: postId }).likes({
      where: likeWhere
    })

    return await prisma.deleteLike({ id: likeMatches[0].id })
  } else {
    const postUser = await prisma.post({ id: postId }).user()
    if (postUser.id === userId) {
      throw new Error('You can not like your own post')
    }

    return await prisma.createLike({
      user: { connect: { id: userId } },
      post: { connect: { id: postId }}
    })
  }
}
