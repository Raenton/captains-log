exports.users = (_parent, _args, context) => {
  return context.prisma.users()
}

exports.user = async (_parent, args, context) => {
  const user = await context.prisma.user({ id: args.id })
  if (!user) {
    throw new Error('User does not exist')
  }
  return user
}
