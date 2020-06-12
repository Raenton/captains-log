const expect = require('chai').expect
const sinon = require('sinon')
const User = require('../../../../src/resolvers/queries/user.query')
const dbHelper = require('../../helpers/dbHelper')
const fixtures = require('../../fixtures')
const { buildContext } = require('../../helpers/contextBuilder')

describe('[Queries] User', function() {
  
  describe('users', function() {

    before(async () => await dbHelper.clear())

    it('should return an object with paginated users (success)', async function() {
      const context = buildContext()
      const created = await dbHelper.createManyUsers(fixtures.users)
      created.sort((a, b) => {
        return a.createdAt > b.createdAt
          ? -1
          : 1
      })
      // expect pagination's first item to match most recently created user
      const mostRecent = created[0]
      const secondMostRecent = created[1]

      const response = await User.users(null, {
        paginationInput: {
          first: 2
        }
      }, context)

      expect(response.count).to.equal(2)
      expect(response.edges.length).to.equal(2)
      expect(response.edges[0].node).to.deep.equal(mostRecent)
      expect(response.edges[1].node).to.deep.equal(secondMostRecent)
      sinon.assert.match(response.pageInfo, {
        hasPrevPage: false,
        hasNextPage: true,
        startCursor: sinon.match.string,
        endCursor: sinon.match.string
      })
    })

    // it('should return a paginated list after cursor (success)', async function() {
      
    // })

    // it('should return a paginated list before cursor (success)', async function() {

    // })

  })

  describe('user', function() {

    it('should return a found user (success)', async function() {
      const context = buildContext()
      const user = await dbHelper.findOrCreateUser()

      const result = await User.user(null, { id: user.id }, context)

      sinon.assert.match(result, user)
    })

    it('should throw an error if the user does not exist', function(done) {
      const context = buildContext()

      User.user(null, { id: 1 }, context).catch(err => {
        expect(err.message).to.equal('User does not exist')
        done()
      })
    })

  })

})