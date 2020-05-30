const sinon = require('sinon')
const expect = require('chai').expect
const { DbRepository } = require('../../../../src/db/repository')

const fakeItems = [
  {
    id: 1,
    title: 'item_1',
    createdAt: 1
  },
  {
    id: 2,
    title: 'item_2',
    createdAt: 2
  },
  {
    id: 2,
    title: 'item_2',
    createdAt: 3
  }
]

const args = {
  arg: 'arg'
}

describe('[DB] DbRepository', () => {

  it('Constructs a repository with model and utils', () => {
    const model = { findOne: () => {} }
    const utils = { doSomething: () => {} }
    const repository = new DbRepository(model, utils)

    expect(repository.model).to.deep.equal(model)
    expect(repository.utils).to.deep.equal(utils)
  })

  describe('findOne', () => {
    it('returns call to model.findOne with args', () => {
      const model = { findOne: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.findOne(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.findOne, args)
    })
  })

  describe('create', () => {
    it('returns call to model.create with args', () => {
      const model = { create: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.create(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.create, args)
    })
  })

  describe('update', () => {
    it('returns call to model.update with args', () => {
      const model = { update: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.update(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.update, args)
    })
  })

  describe('updateMany', () => {
    it('returns call to model.updateMany with args', () => {
      const model = { updateMany: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.updateMany(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.updateMany, args)
    })
  })

  describe('deleteOne', () => {
    it('returns call to model.delete with args', () => {
      const model = { delete: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.deleteOne(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.delete, args)
    })
  })

  describe('deleteMany', () => {
    it('returns call to model.deleteMany with args', () => {
      const model = { deleteMany: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.deleteMany(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.deleteMany, args)
    })
  })

  describe('upsert', () => {
    it('returns call to model.upsert with args', () => {
      const model = { upsert: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.upsert(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.upsert, args)
    })
  })

  describe('count', () => {
    it('returns call to model.count with args', () => {
      const model = { count: sinon.stub().returns(true) }
      const repository = new DbRepository(model)
  
      const result = repository.count(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(model.count, args)
    })
  })

  describe('exists', () => {
    it('returns true if this.findOne returns truthy', async () => {
      const model = {}
      const repository = new DbRepository(model)
      repository.findOne = sinon.stub().returns({})
  
      const result = await repository.exists(args)
  
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(repository.findOne, args)
    })

    it('returns false if this.findOne returns falsy', async () => {
      const model = {}
      const repository = new DbRepository(model)
      repository.findOne = sinon.stub().returns(null)
  
      const result = await repository.exists(args)
  
      expect(result).to.be.false
      sinon.assert.calledOnceWithExactly(repository.findOne, args)
    })
  })

  describe('paginate', () => {

    it('makes a query with args without cursor', async () => {
      const model = {}
      const repository = new DbRepository(model)
      repository.findMany = sinon.stub().returns([])
  
      const args = {
        select: {
          field1: true,
          field2: true
        },
        where: {
          field1: { startsWith: 'example' }
        },
        first: 1
      }
  
      const expArgs = {
        ...args,
        orderBy: {
          createdAt: 'desc'
        },
        last: undefined
      }
  
      await repository.paginate(args)
  
      sinon.assert.calledOnceWithExactly(repository.findMany, expArgs)
    })
    
    it('makes a query with args with `after` cursor', async () => {
      const utils = {
        fromCursorHash: sinon.stub().callsFake(args => args)
      }
      const repository = new DbRepository({}, utils)
      repository.findMany = sinon.stub().returns([])
  
      const args = {
        select: {
          field1: true,
          field2: true
        },
        where: {
          field1: { startsWith: 'example' }
        },
        first: 1,
        after: '1995-12-17T03:24:00'
      }
  
      const expArgs = {
        select: args.select,
        where: {
          field1: { startsWith: 'example' },
          createdAt: { lt: new Date(args.after) }
        },
        first: 1,
        orderBy: {
          createdAt: 'desc'
        },
        last: undefined
      }
  
      await repository.paginate(args)
  
      sinon.assert.calledOnceWithExactly(utils.fromCursorHash, args.after)
      sinon.assert.calledOnceWithExactly(repository.findMany, expArgs)
    })
    
    it('makes a query with args with `before` cursor', async () => {
      const utils = {
        fromCursorHash: sinon.stub().callsFake(args => args)
      }
      const repository = new DbRepository({}, utils)
      repository.findMany = sinon.stub().returns([])
  
      const args = {
        select: {
          field1: true,
          field2: true
        },
        where: {
          field1: { startsWith: 'example' }
        },
        last: 1,
        before: '1995-12-17T03:24:00'
      }
  
      const expArgs = {
        select: args.select,
        where: {
          field1: { startsWith: 'example' },
          createdAt: { gt: new Date(args.before) }
        },
        last: 1,
        orderBy: {
          createdAt: 'desc'
        },
        first: undefined
      }
  
      await repository.paginate(args)
  
      sinon.assert.calledOnceWithExactly(utils.fromCursorHash, args.before)
      sinon.assert.calledOnceWithExactly(repository.findMany, expArgs)
    })
    
    it('returns an empty page object if no results are found', async () => {
      const repository = new DbRepository({}, {})
      repository.findMany = sinon.stub().returns([])
  
      const args = {
        first: 1
      }
  
      const result = await repository.paginate(args)
      expect(result).to.deep.equal({
        count: 0,
        edges: [],
        pageInfo: {
          hasPrevPage: false,
          hasNextPage: false,
          startCursor: '',
          endCursor: ''
        }
      })
    })
  
    it('counts whether there is a previous and next item', async () => {
      const utils = {
        toCursorHash: sinon.stub().callsFake(createdAt => `cursor_hash_${createdAt}`)
      }
      const repository = new DbRepository({}, utils)
      repository.findMany = sinon.stub().returns(fakeItems)
      repository.count = sinon.stub().returns(1)
  
      await repository.paginate({})
  
      sinon.assert.calledWith(repository.count, {
        first: 1,
        where: {
          createdAt: { lt: fakeItems[fakeItems.length - 1].createdAt }
        }
      })
      sinon.assert.calledWith(repository.count, {
        first: 1,
        where: {
          createdAt: { gt: fakeItems[0].createdAt }
        }
      })
    })
  
    it('result reflects whether there is a previous and next item', async () => {
      const utils = {
        toCursorHash: sinon.stub().callsFake(createdAt => `cursor_hash_${createdAt}`)
      }
      const repository = new DbRepository({}, utils)
      repository.findMany = sinon.stub().returns(fakeItems)
      repository.count = sinon.stub().returns(1)
  
      const result = await repository.paginate({})
  
      expect(result.pageInfo.hasPrevPage).to.be.true
      expect(result.pageInfo.hasNextPage).to.be.true
  
      repository.count = sinon.stub().returns(0)
      const result2 = await repository.paginate({})
  
      expect(result2.pageInfo.hasPrevPage).to.be.false
      expect(result2.pageInfo.hasNextPage).to.be.false
    })
    
    it('returns a populated page object if results are found', async () => {
      const utils = {
        toCursorHash: sinon.stub().callsFake(createdAt => `cursor_hash_${createdAt}`)
      }
      const repository = new DbRepository({}, utils)
      repository.findMany = sinon.stub().returns(fakeItems)
      repository.count = sinon.stub().returns(1)
  
      const result = await repository.paginate({})
  
      expect(result).to.deep.equal({
        count: 3,
        edges: [
          {
            cursor: 'cursor_hash_1',
            node: fakeItems[0]
          }, {
            cursor: 'cursor_hash_2',
            node: fakeItems[1]
          }, {
            cursor: 'cursor_hash_3',
            node: fakeItems[2]
          }
        ],
        pageInfo: {
          hasPrevPage: true,
          hasNextPage: true,
          startCursor: 'cursor_hash_1',
          endCursor: 'cursor_hash_3'
        }
      })
    })

  })

})