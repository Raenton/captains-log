const {
  users,
  user
} = require('../../../src/resolvers/queries/user.query')
const sinon = require('sinon')
const expect = require('chai').expect

describe('[Queries] User', () => {
  
  it('`users` returns a pagination call', (done) => {
    const paginationResponse = {
      //...edges would go here (x10 users)
      pageInfo: {
        hasNextPage: true,
        hasPrevPage: true
      }
    }

    const context = {
      repository: {
        user: {
          paginate: sinon.stub().returns(paginationResponse)
        }
      }
    }

    const paginationInput = {
      first: 10,
      after: 'abcdefghjkl' 
    }
    
    users(null, { paginationInput }, context).then(data => {
      expect(data).to.equal(paginationResponse)
      done()
    })
  })

  it('`user` finds a user with args', (done) => {
    const userResponse = {
      id: 1,
      title: 'post'
    }
    const context = {
      repository: {
        user: {
          findOne: sinon.stub().returns(userResponse)
        }
      }
    }

    user(null, { id: 1 }, context).then(data => {
      sinon.assert.calledOnceWithExactly(context.repository.user.findOne, {
        where: { id: 1 }
      })
      expect(data).to.equal(userResponse)
      done()
    })
  })

  it('`user` throws an error if the user does not exist', (done) => {
    const context = {
      repository: {
        user: {
          findOne: sinon.stub().returns(null)
        }
      }
    }

    user(null, { id: 2 }, context).catch(err => {
      expect(err.message).to.equal('User does not exist')
      done()
    })
  })

})
