const path = require('path')
// always do this before importing anything that might otherwise
// import any app config
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.test')
})

const dbHelper = require('./helpers/dbHelper')

function clearDb(done) {
  dbHelper.clear().then(
    () => done()
  )
}

before(clearDb)
after(clearDb)
