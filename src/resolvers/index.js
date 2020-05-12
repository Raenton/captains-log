module.exports = {
  Query: {
    ...require('./queries/node.query'),
    ...require('./queries/post.query'),
    ...require('./queries/user.query')
  },
  Mutation: {
    ...require('./mutations/like.mutation'),
    ...require('./mutations/post.mutation'),
    ...require('./mutations/user.mutation')
  },
  Node: require('./interfaces/Node'),
  User: require('./types/User'),
  Post: require('./types/Post'),
  Like: require('./types/Like')
}
