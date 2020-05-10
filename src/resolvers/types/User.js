exports.posts = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).posts()
}

exports.likes = (parent, _args, context) => {
  return context.prisma.user({ id: parent.id }).likes()
}

exports.email = async (parent, _args, context) => {
  // conceal email address from other users
  return context.auth.getUserId(context) === parent.id
    ? parent.email
    : null
}
