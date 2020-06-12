const sinon = require('sinon')
const fixtures = require('../../fixtures')
const dbHelper = require('../../helpers/dbHelper')
const { buildContext } = require('../../helpers/contextBuilder')
const Post = require('../../../../src/resolvers/types/post')

describe('[Types] Post', () => {

  describe('user', () => {

    beforeEach(async () => await dbHelper.clear())

    it('finds the user belonging to post (success)', async function() {
      const context = buildContext()
      const user = await dbHelper.findOrCreateUser()
      const createdPost = await dbHelper.createPost(fixtures.posts[0], user)

      const result = await Post.user({ id: createdPost.id }, null, context)
      sinon.assert.match(user, result)
    })

  })

})