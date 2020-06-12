module.exports = {
  Query: {
    ...require('./queries/post.query'),
    ...require('./queries/user.query')
  },
  Mutation: {
    ...require('./mutations/post.mutation'),
    ...require('./mutations/user.mutation')
  },
  User: require('./types/user'),
  Post: require('./types/post')
}
