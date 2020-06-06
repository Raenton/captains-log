const expect = require('chai').expect
const {
  registerInput,
  loginInput
} = require('../../fixtures')
const dbHelper = require('../../helpers/dbHelper')
const context = require('../../../../src/context')
const User = require('../../../../src/resolvers/mutations/user.mutation')

describe('[Mutations] User', function() {
  
  describe('registerUser', function() {
    
    beforeEach(done => {
      dbHelper.clear().then(() => done())
    })

    it('returns a generated token and user object (success)', async function() {
      const response = await User.registerUser({}, {
        registerInput: registerInput
      }, context)
      expect(response.token).to.be.string
      expect(response.user.username).to.equal('test_user')
      expect(response.user.email).to.equal('test@mail.com')
      expect(response.user)
    })

    it('throws an error by violation of unique username constraint', function(done) {
      User.registerUser({}, {
        registerInput: registerInput
      }, context).then(() => {
        User.registerUser({}, {
          registerInput: {
            username: registerInput.username,
            email: 'test_alt@mail.com',
            password: 'test123'
          }
        }, context).catch(err => {
          expect(err.code).to.equal('P2002')
          expect(err.meta.target).to.equal('username')
          done()
        })
      })
    })

    it('throws an error by violation of unique email address constraint', function(done) {
      User.registerUser({}, {
        registerInput: registerInput
      }, context).then(() => {
        User.registerUser({}, {
          registerInput: {
            username: 'test_alt',
            email: registerInput.email,
            password: 'test123'
          }
        }, context).catch(err => {
          expect(err.code).to.equal('P2002')
          expect(err.meta.target).to.equal('email')
          done()
        })
      })
    })

  })

  describe('login', function() {

    beforeEach(done => {
      dbHelper.clear().then(() => done())
    })

    it('returns a generated token and user object (success)', async function() {
      await User.registerUser({}, {
        registerInput: registerInput
      }, context)

      const response = await User.login({}, {
        loginInput: loginInput
      }, context)

      expect(response.token).to.be.string
      expect(response.user.username).to.equal('test_user')
      expect(response.user.email).to.equal('test@mail.com')
      expect(response.user)
    })

    it('throws an error if user does not exist', function(done) {
      User.login({}, { loginInput: loginInput }, context).catch(err => {
        expect(err.message).to.equal('User does not exist')
        done()
      })
    })

    it('throws an error if password is invalid', function(done) {
      User.registerUser({}, {
        registerInput: registerInput
      }, context).then(() => {
        User.login({}, {
          loginInput: {
            email: loginInput.email,
            password: 'incorrect'
          }
        }, context).catch(err => {
          expect(err.message).to.equal('Invalid password')
          done()
        })
      })
    })

  })

})
