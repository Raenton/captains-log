const path = require('path')
const dbHelper = require('./helpers/dbHelper')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.test')
})

dbHelper.findOrCreateUser({
  username: 'test_user',
  email: 'test@mail.com',
  password: 'test123'
})