const sinon = require('sinon')
const expect = require('chai').expect
const { DbRepository } = require('../../src/db/repository')

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

const truthyStub = () => {
  return sinon.stub().returns(true)
}

// this is the shape that a client takes.
// in the case of prisma, it will have the following call patterns:
// prisma.post.findOne()
// prisma.post.findOne().user()
// prisma.comment.findMany()
// and so on...
const createClient = () => {
  const clientMethods = {
    findOne: truthyStub(),
    findMany: truthyStub(),
    create: truthyStub(),
    update: truthyStub(),
    updateMany: truthyStub(),
    delete: truthyStub(),
    deleteMany: truthyStub(),
    upsert: truthyStub(),
    count: truthyStub()
  }

  return {
    'model': { ...clientMethods },
    'model2': { ...clientMethods }
  }
}

const createRepository = (client, models = ['model'], context = {}) =>
  new DbRepository(client, models, context)

describe('[DB] Repository', () => {
  it('Constructs a repository with wrapped models', () => {
    const client = createClient()
    const models = ['model', 'model2']
    const repository = createRepository(client, models)
    expect(repository.model).to.exist
    expect(repository.model2).to.exist

    // wrapper methods that should be applied to the models
    // (separate from clientMethods above; these are what call them)
    const expectedMethods = [
      'findOne',
      'findMany',
      'create',
      'update',
      'updateMany',
      'deleteOne',
      'deleteMany',
      'upsert',
      'count',
      'exists',
      'paginate'
    ]
    expectedMethods.forEach(m => {
      expect(repository.model[m]).to.exist
      expect(repository.model2[m]).to.exist
      expect(typeof repository.model[m]).to.equal('function')
      expect(typeof repository.model2[m]).to.equal('function')
    })
  })

  it('`model.findOne` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.findOne(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.findOne, args)
  })

  it('`model.create` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.create(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.create, args)
  })

  it('`model.update` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.update(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.update, args)
  })

  it('`model.updateMany` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.updateMany(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.updateMany, args)
  })

  it('`model.deleteOne` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.deleteOne(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.delete, args)
  })

  it('`model.deleteMany` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.deleteMany(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.deleteMany, args)
  })

  it('`model.upsert` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.upsert(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.upsert, args)
  })

  it('`model.count` calls client model interface with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)
    const args = { arg: 'arg' }
    const result = repository.model.count(args)
    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(client.model.count, args)
  })

  it('`model.exists` returns true if _wrapperFuncs.findOne returns truthy', async () => {
    const client = createClient()
    const repository = createRepository(client)
    repository._wrapperFuncs.findOne = sinon.stub().returns(true)

    const args = { arg: 'arg' }
    const result = await repository.model.exists(args)

    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(
      repository._wrapperFuncs.findOne,
      client,
      'model',
      args
    )
  })

  it('`model.exists` returns false if _wrapperFuncs.findOne returns falsy', async () => {
    const client = createClient()
    const repository = createRepository(client)
    repository._wrapperFuncs.findOne = sinon.stub().returns(false)

    const args = { arg: 'arg' }
    const result = await repository.model.exists(args)

    expect(result).to.be.false
    sinon.assert.calledOnceWithExactly(
      repository._wrapperFuncs.findOne,
      client,
      'model',
      args
    )
  })

  it('`model.paginate` makes a query with args without cursor', async () => {
    const client = createClient()
    const context = { utils: {} }
    const repository = createRepository(client, ['model'], context)
    repository._wrapperFuncs.findMany = sinon.stub().returns([])

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

    await repository.model.paginate(args)

    sinon.assert.calledOnceWithExactly(
      repository._wrapperFuncs.findMany,
      client,
      'model',
      expArgs
    )
  })
  
  it('`model.paginate` makes a query with args with `after` cursor', async () => {
    const client = createClient()
    const context = {
      utils: {
        fromCursorHash: sinon.stub().callsFake(args => args)
      }
    }
    const repository = createRepository(client, ['model'], context)
    repository._wrapperFuncs.findMany = sinon.stub().returns([])

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

    await repository.model.paginate(args)

    sinon.assert.calledOnceWithExactly(context.utils.fromCursorHash, args.after)
    sinon.assert.calledOnceWithExactly(repository._wrapperFuncs.findMany,
      client,
      'model',
      expArgs
    )
  })
  
  it('`model.paginate` makes a query with args with `before` cursor', async () => {
    const client = createClient()
    const context = {
      utils: {
        fromCursorHash: sinon.stub().callsFake(args => args)
      }
    }
    const repository = createRepository(client, ['model'], context)
    repository._wrapperFuncs.findMany = sinon.stub().returns([])

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

    await repository.model.paginate(args)

    sinon.assert.calledOnceWithExactly(context.utils.fromCursorHash, args.before)
    sinon.assert.calledOnceWithExactly(repository._wrapperFuncs.findMany,
      client,
      'model',
      expArgs
    )
  })
  
  it('`model.paginate` returns an empty page object if no results are found', async () => {
    const client = createClient()
    const repository = createRepository(client, ['model'])
    repository._wrapperFuncs.findMany = sinon.stub().returns([])

    const args = {
      first: 1
    }

    const result = await repository.model.paginate(args)
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

  it('`model.paginate` counts whether there is a previous and next item', async () => {
    const client = createClient()
    const context = {
      utils: {
        toCursorHash: sinon.stub().callsFake(createdAt => `cursor_hash_${createdAt}`)
      }
    }
    const repository = createRepository(client, ['model'], context)
    repository._wrapperFuncs.findMany = sinon.stub().returns(fakeItems)
    repository._wrapperFuncs.count = sinon.stub().returns(1)

    await repository.model.paginate({})

    sinon.assert.calledWith(repository._wrapperFuncs.count,
      client,
      'model',
      {
        first: 1,
        where: {
          createdAt: { lt: fakeItems[fakeItems.length - 1].createdAt }
        }
      }
    )
    sinon.assert.calledWith(repository._wrapperFuncs.count,
      client,
      'model',
      {
        first: 1,
        where: {
          createdAt: { gt: fakeItems[0].createdAt }
        }
      }
    )
  })
  
  it('`model.paginate` returns a populated page object if results are found', async () => {
    const client = createClient()
    const context = {
      utils: {
        toCursorHash: sinon.stub().callsFake(createdAt => `cursor_hash_${createdAt}`)
      }
    }
    const repository = createRepository(client, ['model'], context)
    repository._wrapperFuncs.findMany = sinon.stub().returns(fakeItems)
    repository._wrapperFuncs.count = sinon.stub().returns(1)

    const result = await repository.model.paginate({})

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