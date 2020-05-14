exports.posts = async (_parent, args, context) => {
  return await context.utils.paginate(args.paginationInput, context, 'post')
}

exports.post = async (_parent, args, context) => {
  const post = await context.prisma.post.findOne({
    where: { id: parseInt(args.id) }
  })
  if (!post) {
    throw new Error('Post does not exist')
  }
  return post
}
