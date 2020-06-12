const expect = require('chai').expect
const sinon = require('sinon')
const fixtures = require('../../fixtures')
const dbHelper = require('../../helpers/dbHelper')
const { buildContext } = require('../../helpers/contextBuilder')
const User = require('../../../../src/resolvers/types/user')

describe('[Types] User', () => {

  describe('posts', () => {

    beforeEach(async () => await dbHelper.clear())

    it('paginates posts belonging to user (success)', async function() {
      const context = buildContext()
      const user = await dbHelper.findOrCreateUser()
      await dbHelper.createManyPosts(fixtures.posts, user)

      const result = await User.posts({ id: user.id }, {
        paginationInput: { first: 1 }
      }, context)
      
      expect(result.count).to.equal(1)
      expect(result.edges.length).to.equal(1)
      expect(result.edges[0].node).to.exist
      sinon.assert.match(result.pageInfo, {
        hasPrevPage: false,
        hasNextPage: true,
        startCursor: sinon.match.string,
        endCursor: sinon.match.string
      })
    })

  })

  describe('email', () => {

    beforeEach(async () => await dbHelper.clear())

    it('returns user email if currently logged in as that user', async function() {
      const { token, user } = await dbHelper.loginAsTest()
      const context = buildContext({
        request: { get: () => 'Bearer ' + token }
      })

      const result = await User.email(user, null, context)
      expect(result).to.equal(user.email)
    })

    it('returns null if not currently logged in as that user', async function() {
      const user = await dbHelper.findOrCreateUser()
      const context = buildContext({
        request: { get: () => undefined }
      })

      const result = await User.email(user, null, context)
      expect(result).to.equal(null)
    })

  })

})