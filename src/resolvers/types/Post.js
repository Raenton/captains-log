exports.user = (parent, _args, context) => {
  return context.prisma.post({ id: parent.id }).user()
}

exports.likes = async (parent, _args, context) => {
  const likes = await context.prisma.post({ id: parent.id }).likes()
  return likes && likes.length
    ? likes
    : []
}
