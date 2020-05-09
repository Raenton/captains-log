exports.user = (parent, _args, context) => {
  return context.prisma.like({ id: parent.id }).user()
}

exports.post = (parent, _args, context) => {
  return context.prisma.like({ id: parent.id }).post()
}
