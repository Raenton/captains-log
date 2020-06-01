const {
  users,
  user
} = require('../../../../src/resolvers/queries/user.query')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../helpers/contextBuilder')

describe('[Queries] User', () => {

  describe('users', () => {

    const paginationInput = {
      first: 10,
      after: 'abcdefghjkl' 
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .userRepository({
          paginate: sinon.stub().returns({})
        })
        .get()
    })

    it('calls userRepository.paginate with args', async () => {
      await users(null, { paginationInput }, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.paginate, paginationInput)
    })

    it('returns the pagination response', async () => {
      const result = await users(null, { paginationInput }, context)
      expect(result).to.deep.equal({})
    })

  })
  
  describe('user', () => {

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .userRepository({
          findOne: sinon.stub().returns({
            id: 1
          })
        })
        .get()
    })

    it('calls userRepository.findOne with args', async () => {
      await user(null, { id: 1 }, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.findOne, {
        where: { id: 1 }
      })
    })

    it('returns the found user', async () => {
      const result = await user(null, { id: 1 }, context)
      expect(result).to.deep.equal({
        id: 1
      })
    })

    it('throws an error if the user does not exist', (done) => {
      context.userRepository.findOne = () => null
      user(null, { id: 2 }, context).catch(err => {
        expect(err.message).to.equal('User does not exist')
        done()
      })
    })

  })

})
