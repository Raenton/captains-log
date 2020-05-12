exports.posts = async (_parent, args, context) => {
  const { utils, prisma } = context
  const { first, after } = args.paginationInput

  const where = after ? {
    createdAt_lt: utils.fromCursorHash(after)
  } : {}

  const posts = await prisma.posts({
    where: where,
    first: first + 1,
    orderBy: 'createdAt_DESC'
  })

  const hasNextPage = posts.length > first
  
  const nodes = hasNextPage
    ? posts.slice(0, -1)
    : posts

  const edges = nodes.map(node => ({ node }))
  const endCursor = utils.toCursorHash(
    edges[edges.length - 1].node.createdAt.toString()
  )

  return {
    count: edges.length,
    edges: edges,
    pageInfo: {
      hasNextPage, endCursor
    }
  }
}
