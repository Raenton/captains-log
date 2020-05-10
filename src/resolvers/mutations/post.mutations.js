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

exports.updatePost = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { id, title, body, description } = args.postInput
  const userId = auth.authenticate(context)
  const postWhere = { id }
  const postExists = await prisma.$exists.post(postWhere)

  if (!postExists) {
    throw new Error('Post does not exist')
  }

  const postUser = await prisma.post(postWhere).user()
  if (userId !== postUser.id) {
    throw new Error('You can not edit another users post')
  }

  return prisma.updatePost({
    data: { title, body, description },
    where: postWhere
  })
}

exports.deletePost = async (_parent, args, context) => {
  const { auth, prisma } = context
  const userId = auth.authenticate(context)
  const postWhere = { id } = args

  const postExists = await prisma.$exists.post(postWhere)

  if (!postExists) {
    throw new Error('Post does not exist')
  }

  const postUser = await prisma.post(postWhere).user()
  if (userId !== postUser.id) {
    throw new Error('You can not delete another users post')
  }

  await prisma.deleteManyLikes({
    post: postWhere
  })

  return prisma.deletePost(postWhere)
}
