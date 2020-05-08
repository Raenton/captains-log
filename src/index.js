const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const resolvers = require('./resolvers')
const auth = require('./utils/auth')

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      auth,
      prisma
    }
  }
})

server.start({
  port: 4001
}, () => console.log(`Server is running on http://localhost:4001`))
