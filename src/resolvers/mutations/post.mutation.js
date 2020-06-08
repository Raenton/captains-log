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
  const { id, title, body, description } = args.postInput
  const userId = auth.authenticate(context)
  const where = { id: parseInt(id) }
  
  const exists = await postRepository.exists({ where })

  if (!exists) {
    throw new Error('Post does not exist')
  }

  const postUser = await postRepository.findOne({ where }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not edit another users post')
  }

  const data = {
    title,
    body,
    description,
    updatedAt: new Date()
  }

  return await postRepository.update({ data, where })
}

exports.deletePost = async (_parent, args, context) => {
  const { auth, postRepository } = context
  const where = { id: parseInt(args.id) }
  const userId = auth.authenticate(context)

  const exists = await postRepository.exists({ where })

  if (!exists) {
    throw new Error('Post does not exist')
  }

  const postUser = await postRepository.findOne({ where }).user()
  if (userId !== postUser.id) {
    throw new Error('You can not delete another users post')
  }

  return await postRepository.deleteOne({ where })
}
