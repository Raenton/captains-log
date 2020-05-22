exports.posts = async (parent, args, context) => {
  const { first, last, before, after } = args.paginationInput
  return await context.repository.post.paginate({
    where: {
      user: { id: parent.id }
    },
    first,
    last,
    before,
    after
  })
}

// exports.likes = (parent, _args, context) => {
//   return context.prisma.user({ id: parent.id }).likes()
// }

exports.email = (parent, _args, context) => {
  // conceal email address from other users
  return context.auth.getUserId(context) === parent.id
    ? parent.email
    : null
}
