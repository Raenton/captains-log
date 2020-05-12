exports.posts = async (_parent, args, context) => {
  const postsConnection = await context.prisma.postsConnection({
    ...args.paginationInput
  })
  return {
    count: postsConnection.edges.length,
    ...postsConnection
  }
}

exports.post = (_parent, args, context) => {
  return context.prisma.post({ id: args.id })
}
