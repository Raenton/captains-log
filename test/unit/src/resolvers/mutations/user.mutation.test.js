const {
  registerUser,
  login
} = require('../../../../../src/resolvers/mutations/user.mutation')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../../helpers/contextBuilder')

describe('[Mutations] User', () => {

  describe('registerUser', () => {
    const userId = 1
    const args = {
      registerInput: {
        username: 'test_user',
        email: 'test@mail.com',
        password: 'test123'
      }
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .auth({
          hashPassword: sinon.stub().returns('hashed_password'),
          generateToken: sinon.stub().returns('token')
        })
        .userRepository({
          create: sinon.stub().callsFake(args => ({
            id: userId,
            username: args.data.username,
            email: args.data.email,
            passwordHash: args.data.passwordHash
          }))
        })
        .get()
    })
    
    it('hashes the password input', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(
        context.auth.hashPassword,
        args.registerInput.password
      )
    })
  
    it('calls userRepository.create with args & hashed password', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.create, {
        data: {
          username: args.registerInput.username,
          email: args.registerInput.email,
          passwordHash: 'hashed_password'
        }
      })
    })
  
    it('generates a token with id of the created user', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
    })
  
    it('returns a created user with token', async () => {
      const result = await registerUser(null, args, context)
      expect(result).to.deep.equal({
        user: {
          id: userId,
          username: args.registerInput.username,
          email: args.registerInput.email,
          passwordHash: 'hashed_password'
        },
        token: 'token'
      })
    })

  })

  describe('login', () => {
    const userId = 1
    const args = {
      loginInput: {
        email: 'test@mail.com',
        password: 'test123'
      }
    }

    let context

    beforeEach(() => {
      context = contextBuilder
        .reset()
        .auth({
          checkPassword: sinon.stub().returns(true),
          generateToken: sinon.stub().returns('token')
        })
        .userRepository({
          findOne: sinon.stub().returns({
            id: userId,
            passwordHash: 'hashed_password'
          })
        })
        .get()
    })

    it('finds a user', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.findOne, {
        where: { email: args.loginInput.email }
      })
    })
  
    it('throws an error if user is not found', (done) => {
      context.userRepository.findOne = sinon.stub().returns(null)
      login(null, args, context).catch(err => {
        expect(err.message).to.equal('User does not exist')
        done()
      })
    })
  
    it('checks if password attempt is valid', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(
        context.auth.checkPassword,
        args.loginInput.password,
        'hashed_password'
      )
    })
  
    it('throws an error if password attempt is not valid', (done) => {
      context.auth.checkPassword = sinon.stub().returns(false)
      login(null, args, context).catch(err => {
        expect(err.message).to.equal('Invalid password')
        done()
      })
    })
  
    it('generates a token with user id', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
    })
  
    it('returns logged in user with token', async () => {
      const data = await login(null, args, context)
      expect(data).to.deep.equal({
        token: 'token',
        user: {
          id: userId,
          passwordHash: 'hashed_password'
        }
      })
    })

  })
})