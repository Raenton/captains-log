const unStubbed = () => {
  throw new Error(
    '[ContextHelper] attempted to call a method that has not been stubbed or mocked'
  )
}

const applyStub = (stub) => {
  return stub || unStubbed
}

const repository = (args) => ({
  findOne: applyStub(args.findOne),
  findMany: applyStub(args.findMany),
  create: applyStub(args.create),
  update: applyStub(args.update),
  updateMany: applyStub(args.updateMany),
  deleteOne: applyStub(args.deleteOne),
  deleteMany: applyStub(args.deleteMany),
  upsert: applyStub(args.upsert),
  count: applyStub(args.count),
  exists: applyStub(args.exists),
  paginate: applyStub(args.paginate)
})

const contextBuilder = {
  context: {},

  get: function () {
    return this.context
  },

  reset: function () {
    this.context = {}
    return this
  },

  auth: function(args) {
    this.context.auth = {
      authenticate: applyStub(args.authenticate),
      getUserId: applyStub(args.getUserId),
      isCurrentUser: applyStub(args.isCurrentUser),
      getTokenFromHeader: applyStub(args.getTokenFromHeader),
      verifyToken: applyStub(args.verifyToken),
      generateToken: applyStub(args.generateToken),
      hashPassword: applyStub(args.hashPassword),
      checkPassword: applyStub(args.checkPassword)
    }
    return this
  },

  utils: function(args) {
    this.context.utils = {
      toCursorHash: applyStub(args.toCursorHash),
      fromCursorHash: applyStub(args.fromCursorHash)
    }
    return this
  },

  postRepository: function(args) {
    this.context.postRepository = repository(args)
    return this
  },

  userRepository: function(args) {
    this.context.userRepository = repository(args)
    return this
  }
}

module.exports = { contextBuilder }