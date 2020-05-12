exports.toCursorHash = (string) => Buffer.from(string).toString('base64');

exports.fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');

// exports.paginate = async (where, args, context, type) => {
//   const { first, after } = args

//   if (after) {
//     where['createdAt_lt'] = this.fromCursorHash(after)
//   }

//   const data = await context.prisma[type]({
//     where: where,
//     first: first + 1,
//     orderBy: 'createdAt_DESC'
//   })

//   const hasNextPage = data.length > first
  
//   const nodes = hasNextPage
//     ? data.slice(0, -1)
//     : data

//   const edges = nodes.map(node => ({ node }))
//   const endCursor = this.toCursorHash(
//     edges[edges.length - 1].node.createdAt.toString()
//   )

//   return {
//     count: edges.length,
//     edges: edges,
//     pageInfo: {
//       hasNextPage, endCursor
//     }
//   }
// }
