const User = require('../../../src/resolvers/types/User')
const sinon = require('sinon')
const expect = require('chai').expect

describe('[Types] User', () => {

  it('`User.posts` should get paginated posts belonging to user', (done) => {
    const parent = { id: 1 }
    const args = {
      paginationInput: {
        first: 3,
        after: 'cursor'
      }
    }
    const postsResponse = {
      // 3x user edges...
      pageInfo: {
        hasNextPage: true,
        hasPrevPage: true
      }
    }
    const context = {
      repository: {
        post: {
          paginate: sinon.stub().returns(postsResponse)
        }
      }
    }

    User.posts(parent, args, context).then(data => {
      sinon.assert.calledOnceWithExactly(context.repository.post.paginate, {
        where: { user: { id: 1 } },
        first: 3,
        after: 'cursor',
        last: undefined,
        before: undefined
      })
      expect(data).to.deep.equal(postsResponse)
      done()
    })
  })

  it('`User.email` should return email if logged in as matching user', () => {
    const parent = {
      id: 1,
      email: 'test@mail.com'
    }
    const context = {
      auth: {
        getUserId: sinon.stub().returns(1)
      }
    }

    const result = User.email(parent, null, context)
    expect(result).to.equal(parent.email)
    sinon.assert.calledOnceWithExactly(context.auth.getUserId, context)
  })

  it('`User.email` should return null email if not logged in as matching user', () => {
    const parent = {
      id: 1,
      email: 'test@mail.com'
    }
    const context = {
      auth: {
        getUserId: sinon.stub().returns(2)
      }
    }

    const result = User.email(parent, null, context)
    expect(result).to.be.null
    sinon.assert.calledOnceWithExactly(context.auth.getUserId, context)
  })

})