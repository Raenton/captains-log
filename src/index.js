const { GraphQLServer } = require('graphql-yoga')
const { createContext } = require('./context')
const resolvers = require('./resolvers')

const context = createContext()

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
