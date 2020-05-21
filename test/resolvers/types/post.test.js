const {
  user
} = require('../../../src/resolvers/types/Post')
const sinon = require('sinon')
const expect = require('chai').expect

describe('[Types] Post', () => {

  it('`user` resolver calls repository.post.findOne(args).user()', () => {
    const findSpy = sinon.spy()
    const findUserSpy = sinon.spy()
    const context = {
      repository: {
        post: {
          findOne: (args) => {
            findSpy(args)
            return {
              user: findUserSpy
            }
          }
        }
      }
    }

    user({ id: 1 }, null, context)
    sinon.assert.calledOnceWithExactly(findSpy, {
      where: { id: 1 }
    })
    sinon.assert.calledOnceWithExactly(findUserSpy)
  })

  it('`user` returns the result of repository.post.findOne(args).user()', () => {
    const userResponse = { id: 1, username: 'test_user' }
    const context = {
      repository: {
        post: {
          findOne: () => {
            return {
              user: sinon.stub().returns(userResponse)
            }
          }
        }
      }
    }

    const result = user({ id: 1 }, null, context)
    expect(result).to.equal(userResponse)
  })

})
