const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('./resolvers')
const context = require('./context')

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      ...context
    }
  }
})

server.start({
  port: process.env.PORT
}, () => console.log(`Server is running on http://localhost:${process.env.PORT}`))
