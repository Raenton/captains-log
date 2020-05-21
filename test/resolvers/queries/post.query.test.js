const {
  posts,
  post
} = require('../../../src/resolvers/queries/post.query')
const sinon = require('sinon')
const expect = require('chai').expect

describe('[Queries] Post', () => {
  
  it('`posts` returns a pagination call', (done) => {
    const paginationResponse = {
      pageInfo: {
        hasNextPage: true,
        hasPrevPage: true
      }
    }

    const context = {
      repository: {
        post: {
          paginate: sinon.stub().returns(paginationResponse)
        }
      }
    }

    const paginationInput = {
      first: 10,
      after: 'abcdefghjkl' 
    }
    
    posts(null, { paginationInput }, context).then(data => {
      expect(data).to.equal(paginationResponse)
      done()
    })
  })

  it('`post` finds a post with args', (done) => {
    const postResponse = {
      id: 1,
      title: 'post'
    }
    const context = {
      repository: {
        post: {
          findOne: sinon.stub().returns(postResponse)
        }
      }
    }

    post(null, { id: 1 }, context).then(data => {
      sinon.assert.calledOnceWithExactly(context.repository.post.findOne, {
        where: { id: 1 }
      })
      expect(data).to.equal(postResponse)
      done()
    })
  })

  it('`post` throws an error if the post does not exist', (done) => {
    const context = {
      repository: {
        post: {
          findOne: sinon.stub().returns(null)
        }
      }
    }

    post(null, { id: 2 }, context).catch(err => {
      expect(err.message).to.equal('Post does not exist')
      done()
    })
  })

})
