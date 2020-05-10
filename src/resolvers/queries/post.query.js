exports.posts = (_parent, _args, context) => {
  return context.prisma.posts()
}

exports.post = async (_parent, args, context) => {
  return context.prisma.post({ id: args.id })
}
