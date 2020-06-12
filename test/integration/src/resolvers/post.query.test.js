const expect = require('chai').expect
const sinon = require('sinon')
const Post = require('../../../../src/resolvers/queries/post.query')
const dbHelper = require('../../helpers/dbHelper')
const fixtures = require('../../fixtures')
const { buildContext } = require('../../helpers/contextBuilder')

describe('[Queries] Post', function() {
  
  describe('posts', function() {

    before(async () => await dbHelper.clear())

    it('should return an object with paginated posts (success)', async function() {
      const context = buildContext()
      const user = await dbHelper.findOrCreateUser()
      await dbHelper.createManyPosts(fixtures.posts, user)

      const response = await Post.posts(null, {
        paginationInput: {
          first: 2
        }
      }, context)

      expect(response.count).to.equal(2)
      expect(response.edges.length).to.equal(2)
      expect(response.edges[0].node).to.exist
      expect(response.edges[1].node).to.exist
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

  describe('post', function() {

    it('should return a found post (success)', async function() {
      const context = buildContext()
      const user = await dbHelper.findOrCreateUser()
      const created = await dbHelper.createPost(fixtures.posts[0], user)
      const result = await Post.post(null, { id: created.id }, context)
      sinon.assert.match(result, created)
    })

    it('should throw an error if the post does not exist', function(done) {
      const context = buildContext()

      Post.post(null, { id: 1 }, context).catch(err => {
        expect(err.message).to.equal('Post does not exist')
        done()
      })
    })

  })

})