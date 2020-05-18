const sinon = require('sinon')
const expect = require('chai').expect
const { DbRepository } = require('../../src/db/repository')

const truthyStub = () => {
  return sinon.stub().returns(true)
}

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

const createRepository = (client) => new DbRepository(client, [
  'model',
  'model2'
])

describe('[DB] Repository', () => {
  it('Constructs a repository with wrapped models', () => {
    const client = createClient()
    const repository = createRepository(client)
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
      'exists'
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

  it('`model.exists` calls client.model.findOne with arguments', () => {
    const client = createClient()
    const repository = createRepository(client)

    const args = { arg: 'arg' }
    repository.model.exists(args)
    
    sinon.assert.calledOnceWithExactly(client.model.findOne, args)
  })

  it('`model.exists` returns true if client.model.findOne returns truthy', async () => {
    const client = createClient()
    const modifiedClient = { 
      ...client,
      model: { findOne: sinon.stub().returns({}) }
    }
    const repository = createRepository(modifiedClient)

    const args = { arg: 'arg' }
    const result = await repository.model.exists(args)

    expect(result).to.be.true
    sinon.assert.calledOnceWithExactly(modifiedClient.model.findOne, args)
  })

  it('`model.exists` returns false if client.model.findOne returns falsy', async () => {
    const client = createClient()
    const modifiedClient = { 
      ...client,
      model: { findOne: sinon.stub().returns(null) }
    }
    const repository = createRepository(modifiedClient)

    const args = { arg: 'arg' }
    const result = await repository.model.exists(args)

    expect(result).to.be.false
    sinon.assert.calledOnceWithExactly(modifiedClient.model.findOne, args)
  })
})