exports.posts = async (parent, args, context) => {
  return await context.utils.paginate(args.paginationInput, context, 'post', {
    user: { id: parent.id }
  })
}

exports.likes = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).likes()
}

exports.email = (parent, _args, context) => {
  // conceal email address from other users
  return context.auth.getUserId(context) === parent.id
    ? parent.email
    : null
}
