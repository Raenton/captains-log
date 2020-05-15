const sinon = require('sinon')
const expect = require('chai').expect
const { DbRepository } = require('../../src/db/repository')

const truthyStub = () => {
  return sinon.stub().returns(true)
}

const client = {
  'model': {
    findOne: truthyStub(),
    findMany: truthyStub(),
    create: truthyStub(),
    update: truthyStub(),
    updateMany: truthyStub(),
    delete: truthyStub(),
    deleteMany: truthyStub(),
    upsert: truthyStub()
  }
}
const repository = new DbRepository(client)

describe('[DB] Repository', () => {
  it('Constructs a repository with database client', () => {
    expect(repository._client).to.deep.equal(client)
  })

  it('`findOne` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.findOne('model', args)
    expect(result).to.be.true
    expect(client['model'].findOne.calledOnceWith(args)).to.be.true
  })

  it('`findMany` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.findMany('model', args)
    expect(result).to.be.true
    expect(client['model'].findMany.calledOnceWith(args)).to.be.true
  })

  it('`create` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.create('model', args)
    expect(result).to.be.true
    expect(client['model'].create.calledOnceWith(args)).to.be.true
  })

  it('`update` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.update('model', args)
    expect(result).to.be.true
    expect(client['model'].update.calledOnceWith(args)).to.be.true
  })

  it('`updateMany` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.updateMany('model', args)
    expect(result).to.be.true
    expect(client['model'].updateMany.calledOnceWith(args)).to.be.true
  })

  it('`deleteOne` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.deleteOne('model', args)
    expect(result).to.be.true
    expect(client['model'].delete.calledOnceWith(args)).to.be.true
  })

  it('`deleteMany` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.deleteMany('model', args)
    expect(result).to.be.true
    expect(client['model'].deleteMany.calledOnceWith(args)).to.be.true
  })

  it('`upsert` calls client model interface with arguments', () => {
    const args = { arg: 'arg' }
    const result = repository.upsert('model', args)
    expect(result).to.be.true
    expect(client['model'].upsert.calledOnceWith(args)).to.be.true
  })
})