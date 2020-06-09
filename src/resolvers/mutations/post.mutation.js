exports.post = async (_parent, args, context) => {
  const { auth, postRepository } = context
  const { title, body, description } = args.postInput
  const userId = auth.authenticate(context)

  return await postRepository.create({
    data: {
      title,
      body,
      description,
      user: { connect: { id: userId }}
    }
  })
}

exports.updatePost = async (_parent, args, context) => {
  const { auth, postRepository } = context
  const { id, title, body, description, published } = args.postInput
  const userId = auth.authenticate(context)
  const where = { id: parseInt(id) }
  const post = await postRepository.findOne({ where })

  if (post) {
    if (userId === post.authorId) {
      return await postRepository.update({
        data: {
          title,
          body,
          description,
          published,
          updatedAt: new Date()
        },
        where
      })
    } else {
      throw new Error('You can not edit another users post')
    }
  } else {
    throw new Error('Post does not exist')
  }
}

exports.deletePost = async (_parent, args, context) => {
  const { auth, postRepository } = context
  const userId = auth.authenticate(context)
  const where = { id: parseInt(args.id) }
  const post = await postRepository.findOne({ where })

  if (post) {
    if (userId === post.authorId) {
      return await postRepository.deleteOne({ where })
    } else {
      throw new Error('You can not delete another users post')
    }
  } else {
    throw new Error('Post does not exist')
  }
}
