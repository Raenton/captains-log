const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
const { DbRepository } = require('./db/repository')
const resolvers = require('./resolvers')
const auth = require('./utils/auth')
const utils = require('./utils/utils')

const prisma = new PrismaClient()
const userRepository = new DbRepository(prisma.user, utils)
const postRepository = new DbRepository(prisma.post, utils)

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      auth,
      utils,
      userRepository,
      postRepository
    }
  }
})

server.start({
  port: process.env.PORT
}, () => console.log(`Server is running on http://localhost:${process.env.PORT}`))
