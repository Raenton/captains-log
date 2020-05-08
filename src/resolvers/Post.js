exports.user = (parent, _args, context) => {
  return context.prisma.post({ id: parent.id }).user()
}
