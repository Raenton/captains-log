exports.users = async (_parent, args, context) => {
  return await context.utils.paginate(args.paginationInput, context, 'user')
}

exports.user = async (_parent, args, context) => {
  const user = await context.prisma.user.findOne({
    where: { id: parseInt(args.id) }
  })
  if (!user) {
    throw new Error('User does not exist')
  }
  return user
}
