exports.users = async (_parent, args, context) => {
  const usersConnection = await context.prisma.usersConnection({
    ...args.paginationInput
  })
  return {
    count: usersConnection.edges.length,
    ...usersConnection
  }
}

exports.user = (_parent, args, context) => {
  return context.prisma.user({ id: args.id })
}
