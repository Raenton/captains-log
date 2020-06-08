const { createContext } = require('../../../../src/context')
const expect = require('chai').expect

describe('[Context]', function() {
  
  it('createContext returns an object with the necessary dependencies', function() {
    const context = createContext()
    expect(context._prisma).to.exist
    expect(context.userRepository).to.exist
    expect(context.postRepository).to.exist
    expect(context.auth).to.exist
    expect(context.utils).to.exist
  })

})
