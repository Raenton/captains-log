const expect = require('chai').expect
const fixtures  = require('../../fixtures')
const dbHelper = require('../../helpers/dbHelper')
const { buildContext } = require('../../helpers/contextBuilder')
const Post = require('../../../../src/resolvers/mutations/post.mutation')

describe('[Mutations] Post', () => {
  
  describe('post', () => {
   
    beforeEach((done) => {
      dbHelper.clear().then(() => done())
    })

    it('should return a new post (success)', async function() {
      const { user, token } = await dbHelper.loginAsTest()
      const context = buildContext({
        request: { get: () => 'Bearer ' + token }
      })

      const response = await Post.post(null, {
        postInput: fixtures.createPostInput
      }, context)

      expect(response.id).to.exist
      expect(response.createdAt).to.exist
      expect(response.updatedAt).to.exist
      expect(response.title).to.equal(fixtures.createPostInput.title)
      expect(response.body).to.equal(fixtures.createPostInput.body)
      expect(response.description).to.equal(fixtures.createPostInput.description)
      expect(response.published).to.be.false
      expect(response.authorId).to.equal(user.id)
    })

    it('should throw an error if not authenticated', function(done) {
      const context = buildContext({
        request: {
          get: () => null
        }
      })
      
      Post.post(null, {
        postInput: fixtures.createPostInput
      }, context).catch(err => {
        expect(err.message).to.equal('Not authenticated')
        done()
      })
    })

  })

  describe('updatePost', () => {

    beforeEach((done) => {
      dbHelper.clear().then(() => done())
    })

    it('returns an updated post (success)', async function() {
      const { token } = await dbHelper.loginAsTest()
      const context = buildContext({
        request: { get: () => 'Bearer ' + token }
      })
      const createdPost = await Post.post(null, {
        postInput: fixtures.createPostInput
      }, context)
      
      const updatedPost = await Post.updatePost(null, {
        postInput: {
          id: createdPost.id,
          ...fixtures.updatePostInput
        }
      }, context)

      expect(updatedPost.id).to.equal(createdPost.id)
      expect(updatedPost.authorId).to.equal(createdPost.authorId)
      expect(updatedPost.createdAt.getTime()).to.equal(createdPost.createdAt.getTime())
      expect(updatedPost.updatedAt.getTime()).to.be.greaterThan(createdPost.updatedAt.getTime())
      expect(updatedPost.title).to.equal(fixtures.updatePostInput.title)
      expect(updatedPost.body).to.equal(fixtures.updatePostInput.body)
      expect(updatedPost.description).to.equal(fixtures.updatePostInput.description)
      expect(updatedPost.published).to.equal(fixtures.updatePostInput.published)
    })

    it('should throw an error if not authenticated', function(done) {
      const context = buildContext({
        request: {
          get: () => null
        }
      })
      
      Post.updatePost(null, { postInput: {} }, context).catch(err => {
        expect(err.message).to.equal('Not authenticated')
        done()
      })
    })

    it('should throw an error if the post does not exist', function(done) {
      dbHelper.loginAsTest().then(({ token }) => {
        const context = buildContext({
          request: { get: () => 'Bearer ' + token }
        })

        Post.updatePost(null, {
          postInput: { id: 1 }
        }, context).catch(err => {
          expect(err.message).to.equal('Post does not exist')
          done()
        })
      })
    })

    it('should throw an error if the post belongs to another user', function(done) {
      dbHelper.loginAsTest().then(originalLoginResult => {
        const originalContext = buildContext({
          request: { get: () => 'Bearer ' + originalLoginResult.token }
        })

        Post.post(null, {
          postInput: fixtures.createPostInput
        }, originalContext).then(createdPost => {

          dbHelper.loginAsTest({
            username: 'test_alt',
            email: 'test_alt@mail.com',
            password: 'test123'
          }).then(loginResult => {
            const context = buildContext({
              request: { get: () => 'Bearer ' + loginResult.token }
            })
            
            Post.updatePost(null, {
              postInput: { id: createdPost.id }
            }, context).catch(err => {
              expect(err.message).to.equal('You can not edit another users post')
              done()
            })
          })
        })
      })
    })

  })
  
  describe('deletePost', () => {

    it('should return the deleted post (success)', async function() {
      const { token } = await dbHelper.loginAsTest()
      const context = buildContext({
        request: { get: () => 'Bearer ' + token }
      })
      const createdPost = await Post.post(null, {
        postInput: fixtures.createPostInput
      }, context)

      const deleted = await Post.deletePost(null, { id: createdPost.id }, context)
      
      expect(deleted.id).to.equal(createdPost.id)
      expect(deleted.createdAt).to.deep.equal(createdPost.createdAt)
      expect(deleted.updatedAt).to.deep.equal(createdPost.updatedAt)
      expect(deleted.title).to.equal(createdPost.title)
      expect(deleted.body).to.equal(createdPost.body)
      expect(deleted.description).to.equal(createdPost.description)
      expect(deleted.published).to.equal(createdPost.published)
      expect(deleted.authorId).to.equal(createdPost.authorId)
    })

    it('should throw an error if the user is not authenticated', function(done) {
      const context = buildContext({
        request: {
          get: () => null
        }
      })
      
      Post.deletePost(null, { id: 1 }, context).catch(err => {
        expect(err.message).to.equal('Not authenticated')
        done()
      })
    })

    it('should throw an error if the post does not exist', function(done) {
      dbHelper.loginAsTest().then(({ token }) => {
        const context = buildContext({
          request: { get: () => 'Bearer ' + token }
        })

        Post.deletePost(null, { id: 1 }, context).catch(err => {
          expect(err.message).to.equal('Post does not exist')
          done()
        })
      })
    })

    it('should throw an error if the post belongs to another user', function(done) {
      dbHelper.loginAsTest().then(originalLoginResult => {
        const originalContext = buildContext({
          request: { get: () => 'Bearer ' + originalLoginResult.token }
        })

        Post.post(null, {
          postInput: fixtures.createPostInput
        }, originalContext).then(createdPost => {

          dbHelper.loginAsTest({
            username: 'test_alt',
            email: 'test_alt@mail.com',
            password: 'test123'
          }).then(loginResult => {
            const context = buildContext({
              request: { get: () => 'Bearer ' + loginResult.token }
            })
            
            Post.deletePost(null, {
              id: createdPost.id
            }, context).catch(err => {
              expect(err.message).to.equal('You can not delete another users post')
              done()
            })
          })
        })
      })
    })

  })
})
