const { twoAreEqual } = require('./')
describe('Server', () => {
  describe('twoAreEqual', () => {
    it('true with 2 & 2', () => {
      expect(twoAreEqual(2,2)).toBe(true)
    })
  })
})