const path = require('path')
const dbHelper = require('./helpers/dbHelper')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.test')
})

function clearDb(done) {
  dbHelper.clear().then(
    () => done()
  )
}

before(clearDb)
after(clearDb)
