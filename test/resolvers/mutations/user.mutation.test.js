const {
  registerUser,
  login
} = require('../../../src/resolvers/mutations/user.mutation')
const sinon = require('sinon')
const expect = require('chai').expect

const userId = 1

const registerUserArgs = {
  registerInput: {
    username: 'test_user',
    email: 'test@mail.com',
    password: 'test123'
  }
}

const loginArgs = {
  loginInput: {
    email: 'test@mail.com',
    password: 'test123'
  }
}

describe('[Mutations] User', () => {

  it('`registerUser` should hash password', (done) => {
    const context = {
      auth: {
        hashPassword: sinon.spy(),
        generateToken: () => 'token'
      },
      repository: {
        user: {
          create: () => ({ id: userId })
        }
      }
    }

    registerUser(null, registerUserArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(
        context.auth.hashPassword,
        registerUserArgs.registerInput.password
      )
      done()
    })
  })

  it('`registerUser` should call repository.user.create with args', (done) => {
    const context = {
      auth: {
        hashPassword: () => 'hashed_password',
        generateToken: () => 'token'
      },
      repository: {
        user: {
          create: sinon.stub().returns({ id: userId })
        }
      }
    }

    registerUser(null, registerUserArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.user.create, {
        data: {
          username: registerUserArgs.registerInput.username,
          email: registerUserArgs.registerInput.email,
          passwordHash: 'hashed_password'
        }
      })
      done()
    })
  })

  it('`registerUser` should generate a token with id of the created user', (done) => {
    const context = {
      auth: {
        hashPassword: () => 'hashed_password',
        generateToken: sinon.stub().returns('token')
      },
      repository: {
        user: {
          create: () => ({ id: userId })
        }
      }
    }

    registerUser(null, registerUserArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
      done()
    })
  })

  it('`registerUser` should return a created user with token', (done) => {
    const context = {
      auth: {
        hashPassword: () => 'hashed_password',
        generateToken: sinon.stub().returns('token')
      },
      repository: {
        user: {
          create: sinon.stub().callsFake(args => ({
            id: userId,
            username: args.data.username,
            email: args.data.email,
            passwordHash: args.data.passwordHash
            // createdAt...
            // updatedAt...
          }))
        }
      }
    }

    registerUser(null, registerUserArgs, context).then(data => {
      expect(data).to.deep.equal({
        user: {
          id: userId,
          username: registerUserArgs.registerInput.username,
          email: registerUserArgs.registerInput.email,
          passwordHash: 'hashed_password'
        },
        token: 'token'
      })
      done()
    })
  })

  it('`login` should find a user', (done) => {
    const context = {
      repository: {
        user: {
          findOne: sinon.stub().returns({
            id: userId,
            passwordHash: 'hashed_password'
          })
        }
      },
      auth: {
        checkPassword: () => true,
        generateToken: () => 'token'
      }
    }

    login(null, loginArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.repository.user.findOne, {
        where: { email: loginArgs.loginInput.email }
      })
      done()
    })
  })

  it('`login` should throw an error if user is not found', (done) => {
    const context = {
      repository: {
        user: {
          findOne: sinon.stub().returns(null)
        }
      },
      auth: {
        checkPassword: () => true,
        generateToken: () => 'token'
      }
    }

    login(null, loginArgs, context).catch(err => {
      expect(err.message).to.equal('User does not exist')
      done()
    })
  })

  it('`login` should check if password attempt is valid', (done) => {
    const context = {
      repository: {
        user: {
          findOne: () => ({
            id: userId,
            passwordHash: 'hashed_password'
          })
        }
      },
      auth: {
        checkPassword: sinon.stub().returns(true),
        generateToken: () => 'token'
      }
    }

    login(null, loginArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(
        context.auth.checkPassword,
        loginArgs.loginInput.password,
        'hashed_password'
      )
      done()
    })
  })

  it('`login` should throw an error if password attempt is not valid', (done) => {
    const context = {
      repository: {
        user: {
          findOne: () => ({
            id: userId,
            passwordHash: 'hashed_password'
          })
        }
      },
      auth: {
        checkPassword: () => false,
        generateToken: () => 'token'
      }
    }

    login(null, loginArgs, context).catch(err => {
      expect(err.message).to.equal('Invalid password')
      done()
    })
  })

  it('`login` should generate a token', (done) => {
    const context = {
      repository: {
        user: {
          findOne: () => ({
            id: userId,
            passwordHash: 'hashed_password'
          })
        }
      },
      auth: {
        checkPassword: () => true,
        generateToken: sinon.stub().returns('token')
      }
    }

    login(null, loginArgs, context).then(() => {
      sinon.assert.calledOnceWithExactly(context.auth.generateToken, userId)
      done()
    })
  })

  it('`login` should return logged in user with token', (done) => {
    const context = {
      repository: {
        user: {
          findOne: () => ({
            id: userId,
            passwordHash: 'hashed_password'
          })
        }
      },
      auth: {
        checkPassword: () => true,
        generateToken: sinon.stub().returns('token')
      }
    }

    login(null, loginArgs, context).then(data => {
      expect(data).to.deep.equal({
        token: 'token',
        user: {
          id: userId,
          passwordHash: 'hashed_password'
        }
      })
      done()
    })
  })

})