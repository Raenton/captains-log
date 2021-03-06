const {
  post,
  updatePost,
  deletePost
} = require('../../../../src/resolvers/mutations/post.mutation')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../helpers/contextBuilder')

describe('[Mutations] Post', () => {

  describe('post', () => {
    const userId = 1
    const args = {
      postInput: {
        title: 'title',
        body: 'body',
        description: 'description'
      }
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .auth({
          authenticate: sinon.stub().returns(userId)
        })
        .postRepository({
          create: sinon.stub().returns({
            title: args.postInput.title,
            body: args.postInput.body,
            description: args.postInput.description,
            user: {
              id: userId
            }
          })
        })
        .get()
    })

    it('authenticates the request', async () => {
      await post(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
    })
  
    it('calls postRepository.create with correct args', async () => {
      await post(null, args, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.create, {
        data: {
          title: args.postInput.title,
          body: args.postInput.body,
          description: args.postInput.description,
          user: { connect: { id: userId }}
        }
      })
    })
  
    it('returns a created post', async () => {
      const result = await post(null, args, context)
      expect(result).to.deep.equal({
        title: args.postInput.title,
        body: args.postInput.body,
        description: args.postInput.description,
        user: { id: userId }
      })
    })

  })

  describe('updatePost', () => {
    const userId = 1
    const args = {
      postInput: {
        id: 123,
        title: 'updated_title',
        body: 'updated_body',
        description: 'updated_description',
        published: true
      }
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .auth({
          authenticate: sinon.stub().returns(userId)
        })
        .postRepository({
          exists: sinon.stub().returns(true),
          findOne: sinon.stub().returns({
            authorId: userId
          }),
          update: sinon.stub().callsFake((args) => ({
            id: args.where.id
          }))
        })
        .get()
    })

    it('authenticates the request', async () => {
      await updatePost(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
    })
  
    it('throws an error if post does not exist', (done) => {
      context.postRepository.findOne = sinon.stub().returns(null)
      updatePost(null, args, context).catch(err => {
        expect(err.message).to.equal('Post does not exist')
        done()
      })
    })
  
    it('throws an error if post does not belong to user', (done) => {
      context.postRepository.findOne = () => ({
        authorId: 999
      })
      updatePost(null, args, context).catch(err => {
        expect(err.message).to.equal('You can not edit another users post')
        done()
      })
    })
  
    it('calls postRepository.update with args', async () => {
      await updatePost(null, args, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.update, sinon.match({
        data: {
          title: args.postInput.title,
          body: args.postInput.body,
          description: args.postInput.description,
          updatedAt: sinon.match.date,
          published: args.postInput.published
        },
        where: {
          id: args.postInput.id
        }
      }))
    })
  
    it('returns an updated post', async () => {
      const result = await updatePost(null, args, context)
      expect(result).to.deep.equal({
        id: args.postInput.id
      })
    })

  })

  describe('deletePost', () => {
    const userId = 1
    const args = {
      id: 123
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .auth({
          authenticate: sinon.stub().returns(userId)
        })
        .postRepository({
          exists: sinon.stub().returns(true),
          findOne: sinon.stub().returns({
            authorId: userId
          }),
          deleteOne: sinon.stub().callsFake((args) => ({
            id: args.where.id
          }))
        })
        .get()
    })

    it('authenticates the request', async () => {
      await deletePost(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
    })
  
    it('throws an error if post does not exist', (done) => {
      context.postRepository.findOne = sinon.stub().returns(null)
      deletePost(null, args, context).catch(err => {
        expect(err.message).to.equal('Post does not exist')
        done()
      })
    })
  
    it('throws an error if post does not belong to user', (done) => {
      context.postRepository.findOne = () => ({
        user: () => ({
          id: 'not_user_id'
        })
      })
  
      deletePost(null, args, context).catch(err => {
        expect(err.message).to.equal('You can not delete another users post')
        done()
      })
    })
  
    it('calls postRepository.deleteOne with args', async () => {
      await deletePost(null, args, context)
      sinon.assert.calledOnceWithExactly(context.postRepository.deleteOne, {
        where: { id: parseInt(args.id) }
      })
    })
  
    it('returns deleted post', async () => {
      const result = await deletePost(null, args, context)
      expect(result).to.deep.equal({ id: args.id })
    })

  })

})
