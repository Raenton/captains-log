exports.users = async (_parent, args, context) => {
  return await context.userRepository.paginate(args.paginationInput)
}

exports.user = async (_parent, args, context) => {
  const user = await context.userRepository.findOne({
    where: { id: parseInt(args.id) }
  })
  if (user) {
    return user
  } else {
    throw new Error('User does not exist')
  }
}
