exports.toggleLike = async (_parent, args, context) => {
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
