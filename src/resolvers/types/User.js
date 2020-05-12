exports.posts = async (parent, args, context) => {
  const postsConnection = await context.prisma.postsConnection({
    where: { user: { id: parent.id }},
    ...args.paginationInput
  })
  return {
    count: postsConnection.edges.length,
    ...postsConnection
  }
}

exports.likes = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).likes()
}

exports.email = async (parent, _args, context) => {
  // conceal email address from other users
  return context.auth.getUserId(context) === parent.id
    ? parent.email
    : null
}
