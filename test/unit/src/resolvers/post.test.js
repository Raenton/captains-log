const {
  user
} = require('../../../../src/resolvers/types/Post')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../helpers/contextBuilder')

describe('[Types] Post', () => {

  describe('user', () => {

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .postRepository({
          findOne: sinon.stub().returns({
            user: sinon.stub().returns({
              id: 1,
              username: 'test_user'
            })
          })
        })
        .get()
    })

    it('calls repository.post.findOne(args).user()', async () => {
      await user({ id: 1 }, null, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.findOne, {
        where: { id: 1 }
      })
      sinon.assert.calledOnceWithExactly(context.postRepository.findOne().user)
    })
  
    it('returns the result of repository.post.findOne(args).user()', async () => {
      const result = await user({ id: 1 }, null, context)
      expect(result).to.deep.equal({
        id: 1,
        username: 'test_user'
      })
    })
  })

})
