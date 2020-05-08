const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config')

exports.authenticate = (context) => {
  const userId = this.getUserId(context)
  if (!userId) {
    throw new Error('Not authenticated')
  }
  return userId
}

exports.getUserId = (context) => {
  const token = this.getTokenFromHeader(context)
  if (!token) {
    return null
  }
  const { userId } = this.verifyToken(token)
  return userId
}

exports.isCurrentUser = (context, id) => {
  const userId = this.getUserId(context)
  return (userId && userId === id)
}

// try catch?
// if auth header is not implemented properly
exports.getTokenFromHeader = (context) => {
  const Authorization = context.request.get('Authorization')
  if (!Authorization) {
    return null
  }

  const parts = Authorization.split(' ')
  if (parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET)
}

exports.generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET)
}

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

exports.checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}
