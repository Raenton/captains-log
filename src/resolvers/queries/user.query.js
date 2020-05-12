exports.users = (_parent, _args, context) => {
  return context.prisma.users()
}

exports.user = (_parent, args, context) => {
  return context.prisma.user({ id: args.id })
}
