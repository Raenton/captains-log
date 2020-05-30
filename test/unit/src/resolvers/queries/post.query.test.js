const {
  posts,
  post
} = require('../../../../../src/resolvers/queries/post.query')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../../helpers/contextBuilder')

describe('[Queries] Post', () => {

  describe('posts', () => {

    const paginationInput = {
      first: 10,
      after: 'abcdefghjkl'
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .postRepository({
          paginate: sinon.stub().returns({})
        })
        .get()
    })

    it('calls postRepository.paginate with args', async () => {
      await posts(null, { paginationInput }, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.paginate, paginationInput)
    })

    it('returns the pagination result', async () => {
      const result = await posts(null, { paginationInput }, context)
      expect(result).to.deep.equal({})
    })

  })

  describe('post', () => {

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .postRepository({
          findOne: sinon.stub().returns({
            id: 123
          })
        })
        .get()
    })

    it('calls postRepository.findOne with args', async () => {
      await post(null, { id: 123 }, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.findOne, {
        where: { id: 123 }
      })
    })

    it('throws an error if the post does not exist', (done) => {
      context.postRepository.findOne = () => null
      post(null, { id: 2 }, context).catch(err => {
        expect(err.message).to.equal('Post does not exist')
        done()
      })
    })

    it('returns the found post', async () => {
      const result = await post(null, { id: 123 }, context)
      expect(result).to.deep.equal({
        id: 123
      })
    })

  })

})
