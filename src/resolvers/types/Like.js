exports.user = (parent, _args, context) => {
  return context.prisma.like({
    where: { id: parent.id }
  }).user()
}

exports.post = (parent, _args, context) => {
  return context.prisma.like({
    where: { id: parent.id }
  }).post()
}
