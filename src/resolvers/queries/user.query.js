exports.users = (_parent, _args, context) => {
  return context.prisma.users()
}

exports.user = async (_parent, args, context) => {
  const { prisma } = context
  const where = { id: args.id }
  const user = await prisma.user(where)
  if (!user) {
    throw new Error('User does not exist')
  }
  return user
}
