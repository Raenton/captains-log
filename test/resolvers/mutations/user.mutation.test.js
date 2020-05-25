const {
  registerUser,
  login
} = require('../../../src/resolvers/mutations/user.mutation')
const sinon = require('sinon')
const expect = require('chai').expect
const { contextBuilder } = require('../../helpers/contextHelper')

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
    
    it('should hash password', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(
        context.auth.hashPassword,
        args.registerInput.password
      )
    })
  
    it('should call userRepository.create with args & hashed password', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.create, {
        data: {
          username: args.registerInput.username,
          email: args.registerInput.email,
          passwordHash: 'hashed_password'
        }
      })
    })
  
    it('should generate a token with id of the created user', async () => {
      await registerUser(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
    })
  
    it('should return a created user with token', async () => {
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

    it('`login` should find a user', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(context.userRepository.findOne, {
        where: { email: args.loginInput.email }
      })
    })
  
    it('`login` should throw an error if user is not found', (done) => {
      context.userRepository.findOne = sinon.stub().returns(null)
      login(null, args, context).catch(err => {
        expect(err.message).to.equal('User does not exist')
        done()
      })
    })
  
    it('`login` should check if password attempt is valid', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(
        context.auth.checkPassword,
        args.loginInput.password,
        'hashed_password'
      )
    })
  
    it('`login` should throw an error if password attempt is not valid', (done) => {
      context.auth.checkPassword = sinon.stub().returns(false)
      login(null, args, context).catch(err => {
        expect(err.message).to.equal('Invalid password')
        done()
      })
    })
  
    it('`login` should generate a token', async () => {
      await login(null, args, context)
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
    })
  
    it('`login` should return logged in user with token', async () => {
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