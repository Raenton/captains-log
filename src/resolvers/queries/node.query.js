exports.node = async (_parent, args, context) => {
  const node = await context.prisma.node({ id: args.id })
  if (!node) {
    throw new Error('Item does not exist')
  }
  return node
}
