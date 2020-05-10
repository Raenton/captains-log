exports.users = (_parent, _args, context) => {
  return context.prisma.users()
}

exports.user = async (_parent, args, context) => {
  return context.prisma.user({ id: args.id })
}

exports.posts = (_parent, _args, context) => {
  return context.prisma.posts()
}

exports.post = async (_parent, args, context) => {
  return context.prisma.post({ id: args.id })
}

