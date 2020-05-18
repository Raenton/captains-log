const {
  post,
  updatePost,
  deletePost
} = require('../../../src/resolvers/mutations/post.mutation')
const sinon = require('sinon')
const expect = require('chai').expect

const createContext = ({
  authenticate,
  create,
  update,
  findOne,
  exists,
  deleteOne
}) => ({
  auth: {
    authenticate: authenticate
  },
  repository: {
    post: {
      create: create,
      update: update,
      findOne: findOne,
      exists: exists,
      deleteOne: deleteOne
    }
  }
})

const userId = 1

const createPostArgs = {
  postInput: {
    title: 'title',
    body: 'body',
    description: 'description'
  }
}

const updatePostArgs = {
  postInput: {
    id: 123,
    title: 'updated_title',
    body: 'updated_body',
    description: 'updated_description'
  }
}

const deletePostArgs = {
  id: 123
}

describe('[Mutations] Post', () => {

  it('`post` calls auth.authenticate', (done) => {
    const context = createContext({
      authenticate: sinon.stub().returns(userId),
      create: () => {}
    })

    post(null, createPostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
      done()
    })
  })

  it('`post` calls repository.post.create with correct args', (done) => {
    const context = createContext({
      authenticate: () => userId,
      create: sinon.stub()
    })

    post(null, createPostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.post.create, {
        data: {
          title: createPostArgs.postInput.title,
          body: createPostArgs.postInput.body,
          description: createPostArgs.postInput.description,
          user: { connect: { id: userId }}
        }
      })
      done()
    })
  })

  it('`post` returns a created post', (done) => {
    const context = createContext({
      authenticate: () => userId,
      create: sinon.stub().callsFake(args => {
        return {
          ...args.data,
          user: { id: args.data.user.connect.id }
        }
      })
    })

    post(null, createPostArgs, context).then(data => {
      expect(data).to.deep.equal({
        title: createPostArgs.postInput.title,
        body: createPostArgs.postInput.body,
        description: createPostArgs.postInput.description,
        user: { id: userId }
      })
      done()
    })
  })

  it('`updatePost` calls auth.authenticate', (done) => {
    const context = createContext({
      authenticate: sinon.stub().returns(userId),
      exists: () => true,
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      update: () => {}
    })
    
    updatePost(null, updatePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
      done()
    })
  })

  it('`updatePost` calls repository.post.exists with args', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(true),
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      update: () => {}
    })

    updatePost(null, updatePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.post.exists, {
        where: { id: parseInt(updatePostArgs.postInput.id) }
      })
      done()
    })
  })

  it('`updatePost` throws an error if post does not exist', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(false)
    })
    
    updatePost(null, updatePostArgs, context).catch(err => {
      expect(err.message).to.equal('Post does not exist')
      done()
    })
  })

  it('`updatePost` calls repository.post.findOne().user() with args', (done) => {
    const findSpy = sinon.spy()
    const findUserSpy = sinon.spy()
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: (args) => {
        findSpy(args)
        return {
          user: () => {
            findUserSpy()
            return {
              id: userId
            }
          }
        }
      },
      update: () => {}
    })

    updatePost(null, updatePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(findSpy, {
        where: { id: parseInt(updatePostArgs.postInput.id) }
      })
      sinon.assert.calledOnce(findUserSpy)
      done()
    })
  })

  it('`updatePost` throws an error if post does not belong to user', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: () => ({
        user: () => ({
          id: 'not_user_id'
        })
      }),
      update: () => {}
    })

    updatePost(null, updatePostArgs, context).catch(err => {
      expect(err.message).to.equal('You can not edit another users post')
      done()
    })
  })

  it('`updatePost` calls repository.post.update with args', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      update: sinon.stub()
    })

    updatePost(null, updatePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.post.update, sinon.match({
        data: {
          title: updatePostArgs.postInput.title,
          body: updatePostArgs.postInput.body,
          description: updatePostArgs.postInput.description,
          updatedAt: sinon.match.date
        },
        where: {
          id: parseInt(updatePostArgs.postInput.id)
        }
      }))
      done()
    })
  })

  it('`updatePost` returns an updated post', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      update: sinon.stub().callsFake((args) => ({
        id: args.where.id
      }))
    })

    updatePost(null, updatePostArgs, context).then(data => {
      expect(data).to.deep.equal({
        id: updatePostArgs.postInput.id
      })
      done()
    })
  })

  it('`deletePost` calls auth.authenticate', (done) => {
    const context = createContext({
      authenticate: sinon.stub().returns(userId),
      exists: () => true,
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      deleteOne: () => null
    })

    deletePost(null, deletePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.auth.authenticate, context)
      done()
    })
  })

  it('`deletePost` calls repository.post.exists with args', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(true),
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      deleteOne: () => null
    })

    deletePost(null, deletePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.post.exists, {
        where: { id: parseInt(deletePostArgs.id) }
      })
      done()
    })
  })

  it('`deletePost` throws an error if post does not exist', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(false),
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      deleteOne: () => null
    })

    deletePost(null, deletePostArgs, context).catch(err => {
      expect(err.message).to.equal('Post does not exist')
      done()
    })
  })

  it('`deletePost` calls repository.post.findOne().user() with args', (done) => {
    const findSpy = sinon.spy()
    const findUserSpy = sinon.spy()
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: (args) => {
        findSpy(args)
        return {
          user: () => {
            findUserSpy()
            return {
              id: userId
            }
          }
        }
      },
      deleteOne: () => null
    })

    deletePost(null, deletePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(findSpy, {
        where: { id: parseInt(deletePostArgs.id) }
      })
      sinon.assert.calledOnce(findUserSpy)
      done()
    })
  })

  it('`deletePost` throws an error if post does not belong to user', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: () => true,
      findOne: (args) => {
        return {
          user: () => {
            return {
              id: 'not_user_id'
            }
          }
        }
      },
      deleteOne: () => null
    })

    deletePost(null, deletePostArgs, context).catch(err => {
      expect(err.message).to.equal('You can not delete another users post')
      done()
    })
  })

  it('`deletePost` calls repository.post.deleteOne with args', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(true),
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      deleteOne: sinon.stub()
    })

    deletePost(null, deletePostArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.post.deleteOne, {
        where: { id: parseInt(deletePostArgs.id) }
      })
      done()
    })
  })

  it('`deletePost` returns deleted post', (done) => {
    const context = createContext({
      authenticate: () => userId,
      exists: sinon.stub().returns(true),
      findOne: () => ({
        user: () => ({
          id: userId
        })
      }),
      deleteOne: sinon.stub().callsFake((args) => ({
        id: args.where.id
      }))
    })

    deletePost(null, deletePostArgs, context).then(data=> {
      expect(data).to.deep.equal({ id: parseInt(deletePostArgs.id) })
      done()
    })
  })
})
