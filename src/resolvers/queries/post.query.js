exports.posts = async (_parent, args, context) => {
  return context.postRepository.paginate(args.paginationInput)
}

exports.post = async (_parent, args, context) => {
  const post = await context.postRepository.findOne({
    where: { id: parseInt(args.id) }
  })
  if (!post) {
    throw new Error('Post does not exist')
  }
  return post
}
