const path = require('path')

let envFile

if (process.env.NODE_ENV === 'development') {
  envFile = path.resolve(process.cwd(), '.env.development')
} else if (process.env.NODE_ENV === 'test') {
  envFile = path.resolve(process.cwd(), '.env.test')
} else {
  envFile = path.resolve(process.cwd(), '.env')
}

require('dotenv').config({
  path: envFile
})

module.exports = process.env

