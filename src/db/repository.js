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
      Boolean(this._wrapperFuncs.findOne(client, model, args)),

    paginate: async (client, model, args, context) => {
      const { utils } = context
      const { select, where, first, last, before, after } = args
    
      const query = {
        select,
        where,
        first,
        last,
        orderBy: {
          createdAt: 'desc'
        }
      }
      
      if (after) {
        query.where['createdAt'] = { lt: new Date(utils.fromCursorHash(after)) }
      } else if (before) {
        query.where['createdAt'] = { gt: new Date(utils.fromCursorHash(before)) }
      }
    
      const result = await this._wrapperFuncs.findMany(client, model, query)
    
      if (!result.length) {
        /**
         * this will occur in two (2) scenarios
         *  a) client error, pageInfo was not respected when making request
         *  b) there are no posts matching query
         */
        return {
          count: 0,
          edges: [],
          pageInfo: {
            hasPrevPage: false,
            hasNextPage: false,
            startCursor: '',
            endCursor: ''
          }
        }
      }
    
      const hasPrevPage = Boolean(
        await this._wrapperFuncs.count(client, model, {
          first: 1,
          where: {
            createdAt: { gt: result[0].createdAt }
          }
        })
      )
    
      const hasNextPage = Boolean(
        await this._wrapperFuncs.count(client, model, {
          first: 1,
          where: {
            createdAt: { lt: result[result.length - 1].createdAt }
          }
        })
      )
    
      const edges = result.map(node => ({
        cursor: utils.toCursorHash(node.createdAt),
        node
      }))
    
      return {
        count: edges.length,
        edges: edges,
        pageInfo: {
          hasPrevPage,
          hasNextPage,
          startCursor: edges[0].cursor,
          endCursor: edges[edges.length - 1].cursor
        }
      }
    }
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
  constructor(client, models, context) {
    this._generateWrappers(client, models, context)
  }

  _generateWrappers(client, models, context) {
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
        this[model][func.name] = (args) => func(client, model, args, context)
      })
    })
  }
}

module.exports = { DbRepository }
