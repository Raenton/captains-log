exports.post = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { title, body, description } = args.postInput

  const userId = auth.authenticate(context)
  const post = await prisma.post.create({
    data: {
      title,
      body,
      description,
      user: { connect: { id: userId }}
    }
  })
  return post
}

exports.updatePost = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { id, title, body, description } = args.postInput
  const userId = auth.authenticate(context)
  const postWhere = { id: parseInt(id) }
  
  const post = await prisma.post.findOne({ where: postWhere })

  if (!post) {
    throw new Error('Post does not exist')
  }

  const postUser = await prisma.post.findOne({ where: postWhere }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not edit another users post')
  }

  return prisma.post.update({
    data: { title, body, description, updatedAt: new Date() },
    where: postWhere
  })
}

exports.deletePost = async (_parent, args, context) => {
  const { auth, prisma } = context
  const postWhere = { id: parseInt(args.id) }
  const userId = auth.authenticate(context)

  const post = await prisma.post.findOne({ where: postWhere })

  if (!post) {
    throw new Error('Post does not exist')
  }

  const postUser = await prisma.post.findOne({ where: postWhere }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not delete another users post')
  }

  return prisma.post.delete({ where: postWhere })
}
