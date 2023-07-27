import { hasOneOfRequiredTags } from '../has-one-of-required-tags'

const projectTags = [
  'resource=vercel',
  'resource=fake',
  'other-fake-tag'
]

describe('hasOneOfRequiredTags', () => {
  describe('matches', () => {
    it('should have a match', () => {
      expect(hasOneOfRequiredTags(projectTags, ['other-fake-tag'])).toEqual(true)
    })

    it('should match with "=" condition', () => {
      expect(hasOneOfRequiredTags(projectTags, ['resource=vercel'])).toEqual(true)
    })

    it('should match with "!=" condition', () => {
      expect(hasOneOfRequiredTags(projectTags, ['resource!=vercel'])).toEqual(true)
    })
  })

  describe('no matches', () => {
    it('should have a match', () => {
      expect(hasOneOfRequiredTags(projectTags, ['other-fake-tags'])).toEqual(false)
    })

    it('should match with "=" condition', () => {
      expect(hasOneOfRequiredTags(projectTags, ['resource=firebase'])).toEqual(false)
    })

    it('should match with "!=" condition', () => {
      expect(hasOneOfRequiredTags(projectTags, ['non-existing-key!=firebase'])).toEqual(false)
    })
  })

  describe('and condition', () => {
    it('should match', () => {
      expect(hasOneOfRequiredTags(projectTags, ['resource=vercel,resource=fake'])).toEqual(true)
      expect(hasOneOfRequiredTags(projectTags, ['resource=vercel,resource!=not-exist'])).toEqual(true)
    })

    it('should not match', () => {
      expect(hasOneOfRequiredTags(projectTags, ['resource=vercel,resource=not-exist'])).toEqual(false)
    })
  })
})
