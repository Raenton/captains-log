const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
const resolvers = require('./resolvers')
const auth = require('./utils/auth')
const utils = require('./utils/utils')

const prisma = new PrismaClient()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      auth,
      utils,
      prisma
    }
  }
})

server.start({
  port: 4001
}, () => console.log(`Server is running on http://localhost:4001`))
