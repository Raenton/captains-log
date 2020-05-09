exports.posts = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).posts()
}

exports.likes = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).likes()
}