class DbRepository {
  constructor(model, utils) {
    this.model = model
    this.utils = utils
  }

  findOne = (args) => this.model.findOne(args)

  findMany = (args) => this.model.findMany(args)

  create = (args) => this.model.create(args)
  
  update = (args) => this.model.update(args)

  updateMany = (args) => this.model.updateMany(args)

  deleteOne = (args) => this.model.delete(args)

  deleteMany = (args) => this.model.deleteMany(args)

  upsert = (args) => this.model.upsert(args)

  count = (args) => this.model.count(args)

  exists = async (args) =>
    Boolean(await this.findOne(args))

  /**
   * this is deeply in need of revision.
   * however, for the sake of getting something working
   * before fussing over the details, it is being left as is.
   */
  paginate = async (args) => {
    const { select, where = {}, first, last, before, after } = args
  
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
      query.where['createdAt'] = { lt: new Date(this.utils.fromCursorHash(after)) }
    } else if (before) {
      query.where['createdAt'] = { gt: new Date(this.utils.fromCursorHash(before)) }
    }
  
    const result = await this.findMany(query)
  
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
      await this.count({
        first: 1,
        where: {
          createdAt: { gt: result[0].createdAt }
        }
      })
    )
  
    const hasNextPage = Boolean(
      await this.count({
        first: 1,
        where: {
          createdAt: { lt: result[result.length - 1].createdAt }
        }
      })
    )
  
    const edges = result.map(node => ({
      cursor: this.utils.toCursorHash(node.createdAt),
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

module.exports = { DbRepository }
