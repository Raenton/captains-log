exports.user = (parent, _args, context) => {
  return context.prisma.post({ id: parent.id }).user()
}

exports.likes = (parent, _args, context) => {
  return context.prisma.post({ id: parent.id }).likes()
}
