const context = require('../../../../src/context')
const expect = require('chai').expect

describe('[Context]', function() {
  
  it('is an object with the necessary dependencies', function() {
    expect(context.userRepository).to.exist
    expect(context.postRepository).to.exist
    expect(context.auth).to.exist
    expect(context.utils).to.exist
  })

})
