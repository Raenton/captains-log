exports.posts = (_parent, _args, context) => {
  return context.prisma.posts()
}

exports.post = async (_parent, args, context) => {
  const post = await context.prisma.post({ id: args.id })
  if (!post) {
    throw new Error('Post does not exist')
  }
  return post
}
