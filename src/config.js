const path = require('path')

const envFile = process.env.NODE_ENV === 'development'
  ? path.resolve(process.cwd(), '.env.development')
  : path.resolve(process.cwd(), '.env')

require('dotenv').config({
  path: envFile
})

module.exports = process.env
