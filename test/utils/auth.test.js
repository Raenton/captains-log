const sinon = require('sinon')
const sinonTest = require('sinon-test')
const test = sinonTest(sinon)
const expect = require('chai').expect
const Auth = require('../../src/utils/auth')
const { SECRET } = require('../../src/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('[Auth]', () => {

  describe('authenticate', () => {

    it('gets user id', test(function() {
      this.stub(Auth, 'getUserId').returns(1)
      Auth.authenticate({})
      sinon.assert.calledOnceWithExactly(Auth.getUserId, {})
    }))

    it('throws an error if userId is falsy (fails to authenticate)', test(function() {
      this.stub(Auth, 'getUserId').returns(null)
      expect(Auth.authenticate.bind(Auth, {})).to.throw('Not authenticated')
    }))

    it('returns user id', test(function() {
      this.stub(Auth, 'getUserId').returns(1)
      const result = Auth.authenticate()
      expect(result).to.equal(1)
    }))

  })

  describe('getUserId', () => {

    it('gets token from header', test(function() {
      this.stub(Auth, 'getTokenFromHeader').returns('token')
      this.stub(Auth, 'verifyToken').returns({ userId: 1 })
      Auth.getUserId({})
      sinon.assert.calledOnceWithExactly(Auth.getTokenFromHeader, {})
    }))

    it('returns null if token is falsy', test(function() {
      this.stub(Auth, 'getTokenFromHeader').returns(null)
      
      const result = Auth.getUserId({})
      expect(result).to.be.null
    }))

    it('verifies token', test(function() {
      this.stub(Auth, 'getTokenFromHeader').returns('token')
      this.stub(Auth, 'verifyToken').returns({ userId: 1 })
      Auth.getUserId()
      sinon.assert.calledOnceWithExactly(Auth.verifyToken, 'token')
    }))

    it('returns userId extracted from verified token', test(function() {
      this.stub(Auth, 'getTokenFromHeader').returns('token')
      this.stub(Auth, 'verifyToken').returns({ userId: 1 })
      const result = Auth.getUserId()
      expect(result).to.equal(1)
    }))

  })

  describe('isCurrentUser', () => {

    it('gets user id', test(function() {
      this.stub(Auth, 'getUserId').returns(1)
      Auth.isCurrentUser({}, 1)
      sinon.assert.calledOnceWithExactly(Auth.getUserId, {})
    }))

    it('returns true if provided id matches user id', test(function() {
      this.stub(Auth, 'getUserId').returns(1)
      const result = Auth.isCurrentUser({}, 1)
      expect(result).to.be.true
    }))

    it('returns false if provided id does not match user id', test(function() {
      this.stub(Auth, 'getUserId').returns(2)
      const result = Auth.isCurrentUser({}, 1)
      expect(result).to.be.false
    }))

  })

  describe('getTokenFromHeader', () => {

    const token = '123.xyz.abc'

    it('gets authorization header from request object', test(function() {
      const context = {
        request: {
          get: this.stub()
        }
      }
      Auth.getTokenFromHeader(context)
      sinon.assert.calledOnceWithExactly(context.request.get, 'Authorization')
    }))

    it('returns null if authorization header is not present', test(function() {
      const context = {
        request: {
          get: () => null
        }
      }
      const result = Auth.getTokenFromHeader(context)
      expect(result).to.be.null
    }))

    it('splits the authorization header into parts', test(function() {
      const splitStub = this.stub().returns(['Bearer', token])
      const context = {
        request: {
          get: () => ({
            split: splitStub
          })
        }
      }
      Auth.getTokenFromHeader(context)
      sinon.assert.calledOnceWithExactly(splitStub, ' ')
    }))

    it('returns null if Authorization header is not Bearer', test(function() {
      const context = {
        request: {
          get: () => ({
            split: () => ['Basic', token]
          })
        }
      }
      const result = Auth.getTokenFromHeader(context)
      expect(result).to.be.null
    }))

    it('returns token portion if Authorization header is Bearer', test(function() {
      const context = {
        request: {
          get: () => ({
            split: () => ['Bearer', token]
          })
        }
      }
      const result = Auth.getTokenFromHeader(context)
      expect(result).to.equal(token)
    }))

  })

  describe('verifyToken', () => {

    it('returns call to token verification', test(function() {
      this.stub(jwt, 'verify').returns(true)
      const result = Auth.verifyToken('token')
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(jwt.verify, 'token', SECRET)
    }))

  })

  describe('generateToken', () => {

    it('returns call to token generation', test(function() {
      this.stub(jwt, 'sign').returns(true)
      const result = Auth.generateToken(1)
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(jwt.sign, {
        userId: 1
      }, SECRET)
    }))

  })

  describe('hashPassword', () => {

    it('returns call to hash function', test(async function() {
      this.stub(bcrypt, 'hash').returns('hashed')
      const result = await Auth.hashPassword('unhashed')
      expect(result).to.equal('hashed')
      sinon.assert.calledOnceWithExactly(bcrypt.hash, 'unhashed', 10)
    }))

  })

  describe('checkPassword', () => {

    it('returns call to hash compare function', test(async function() {
      this.stub(bcrypt, 'compare').returns(true)
      const result = await Auth.checkPassword('password', 'hash')
      expect(result).to.be.true
      sinon.assert.calledOnceWithExactly(bcrypt.compare, 'password', 'hash')
    }))

  })

})