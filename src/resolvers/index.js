module.exports = {
  Query: {
    ...require('./queries/post.query'),
    ...require('./queries/user.query')
  },
  Mutation: {
    ...require('./mutations/like.mutation'),
    ...require('./mutations/post.mutation'),
    ...require('./mutations/user.mutation')
  },
  User: require('./types/User'),
  Post: require('./types/Post'),
  Like: require('./types/Like')
}
