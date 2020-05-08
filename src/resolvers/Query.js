exports.users = (_parent, _args, context) => {
  return context.prisma.users()
}

exports.user = async (_parent, args, context) => {
  const { auth, prisma } = context
  const { id, username, email } = await prisma.user({ id: args.id })

  const userId = auth.getUserId(context)
  const isCurrentUser = (userId && userId === args.id)
  return {
    id,
    username,
    email: isCurrentUser
      ? email
      : null
  }
}
