const expect = require('chai').expect
const sinon = require('sinon')
const {
  toCursorHash,
  fromCursorHash
} = require('../../../../src/utils/utils')

describe('[Utils]', () => {

  before(() => {
    sinon.stub(Buffer, 'from').returns({
      toString: sinon.stub().returns('output')
    })
  })

  after(() => {
    sinon.restore()
  })

  describe('toCursorHash', () => {
    
    beforeEach(() => {
      sinon.resetHistory()
    })
    
    it('creates a Buffer from input string', () => {
      toCursorHash('input')
      sinon.assert.calledOnceWithExactly(Buffer.from, 'input')
    })

    it('parses the buffered string as base64', () => {
      toCursorHash('input')
      sinon.assert.calledOnceWithExactly(Buffer.from().toString, 'base64')
    })

    it('returns the buffered base64 string', () => {
      const result = toCursorHash('input')
      expect(result).to.equal('output')
    })

  })

  describe('fromCursorHash', () => {

    beforeEach(() => {
      sinon.resetHistory()
    })

    it('creates a Buffer from input string as base64', () => {
      fromCursorHash('input')
      sinon.assert.calledOnceWithExactly(Buffer.from, 'input', 'base64')
    })

    it('parses the buffered string as ascii', () => {
      fromCursorHash('input')
      sinon.assert.calledOnceWithExactly(Buffer.from().toString, 'ascii')
    })

    it('returns the buffered ascii string', () => {
      const result = fromCursorHash('input')
      expect(result).to.equal('output')
    })
  })

})
