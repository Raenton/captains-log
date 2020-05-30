const User = require('../../../../../src/resolvers/types/User')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../../helpers/contextBuilder')

describe('[Types] User', () => {

  let context

  beforeEach(() => {
    context = contextBuilder
      .reset()
      .postRepository({
        paginate: sinon.stub().returns({})
      })
      .auth({
        getUserId: sinon.stub().returns(1)
      })
      .get()
  })

  describe('posts', () => {

    it('should call postRepository.paginate with args', async () => {
      const parent = { id: 1 }
      const args = {
        paginationInput: {
          first: 3,
          after: 'cursor'
        }
      }
  
      const result = await User.posts(parent, args, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.paginate, {
        where: { user: { id: 1 } },
        first: 3,
        after: 'cursor',
        last: undefined,
        before: undefined
      })
      expect(result).to.deep.equal({})
    })
  })

  describe('email', () => {

    it('should call auth.getUserId', () => {
      User.email({}, null, context)
      sinon.assert.calledOnceWithExactly(context.auth.getUserId, context)
    })

    it('should return email if logged in as matching user', () => {
      const parent = {
        id: 1,
        email: 'test@mail.com'
      }
  
      const result = User.email(parent, null, context)
      expect(result).to.equal(parent.email)
    })
  
    it('should return null if not logged in as matching user', () => {
      const parent = {
        id: 1,
        email: 'test@mail.com'
      }
      context.auth.getUserId = () => 2
  
      const result = User.email(parent, null, context)
      expect(result).to.be.null
    })
  })

})
