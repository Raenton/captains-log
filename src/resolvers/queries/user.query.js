exports.users = async (_parent, args, context) => {
  return await context.repository.user.paginate(args.paginationInput)
}

exports.user = async (_parent, args, context) => {
  const user = await context.repository.user.findOne({
    where: { id: parseInt(args.id) }
  })
  if (!user) {
    throw new Error('User does not exist')
  }
  return user
}
