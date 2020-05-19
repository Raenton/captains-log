class DbRepository {
  _wrapperFuncs = {
    findOne:(client, model, args) => client[model].findOne(args),

    findMany:(client, model, args) => client[model].findMany(args),
  
    create:(client, model, args) => client[model].create(args),
  
    update:(client, model, args) => client[model].update(args),
  
    updateMany:(client, model, args) => client[model].updateMany(args),
  
    deleteOne:(client, model, args) => client[model].delete(args),
  
    deleteMany:(client, model, args) => client[model].deleteMany(args),
  
    upsert:(client, model, args) => client[model].upsert(args),
  
    count:(client, model, args) => client[model].count(args),

    exists: async (client, model, args) => 
      Boolean(this._wrapperFuncs.findOne(client, model, args))
  }

  /**
   * Create a wrapper around a client so we can abstract away calls
   * to a third party client interface.
   * exposes generic data access functions
   * that act as a wrapper to interchangeable client methods.
   * at the time of creation, 15/05/20, they are intended to wrap
   * the methods on @prisma/client^2.0.0-beta.5
   * @param {object} client // the client to wrap
   * @param {[object]} wrapModels  // models that should be accessible on the client
   */
  constructor(client, models) {
    this._generateWrappers(client, models)
  }

  _generateWrappers(client, models) {
    models.forEach(model => {
      if (!client[model]) {
        throw new TypeError([
          'Attempted to wrap a client model that does not exist.',
          'Please check your client interface.'
        ].join('\n'))
      }
      this[model] = {}
      Object.keys(this._wrapperFuncs).forEach(key => {
        const func = this._wrapperFuncs[key]
        this[model][func.name] = (args) => func(client, model, args)
      })
    })
  }
}

module.exports = { DbRepository }
