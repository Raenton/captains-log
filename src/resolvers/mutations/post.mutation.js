exports.post = async (_parent, args, context) => {
  const { auth, repository } = context
  const { title, body, description } = args.postInput

  const userId = auth.authenticate(context)
  return repository.post.create({
    data: {
      title,
      body,
      description,
      user: { connect: { id: userId }}
    }
  })
}

exports.updatePost = async (_parent, args, context) => {
  const { auth, repository } = context
  const { id, title, body, description } = args.postInput
  const userId = auth.authenticate(context)
  const postWhere = { id: parseInt(id) }
  
  const exists = await repository.post.exists({ where: postWhere })

  if (!exists) {
    throw new Error('Post does not exist')
  }

  const postUser = await repository.post.findOne({ where: postWhere }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not edit another users post')
  }

  return repository.post.update({
    data: { title, body, description, updatedAt: new Date() },
    where: postWhere
  })
}

exports.deletePost = async (_parent, args, context) => {
  const { auth, repository } = context
  const postWhere = { id: parseInt(args.id) }
  const userId = auth.authenticate(context)

  const exists = await repository.post.exists({ where: postWhere })

  if (!exists) {
    throw new Error('Post does not exist')
  }

  const postUser = await repository.post.findOne({ where: postWhere }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not delete another users post')
  }

  return repository.post.deleteOne({ where: postWhere })
}
