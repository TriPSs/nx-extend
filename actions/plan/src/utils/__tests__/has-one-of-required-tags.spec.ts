import { hasOneOfRequiredTags } from '../has-one-of-required-tags'

const projectTags = [
  'resource=vercel',
  'resource=fake',
  'size=big',
  'other-fake-tag'
]

describe('hasOneOfRequiredTags', () => {
  describe('matches', () => {
    it('should have a match', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['other-fake-tag'])).toEqual(true)
    })

    it('should match with "=" condition', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource=vercel'])).toEqual(true)
    })

    it('should match with "!=" condition', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource!=vercel'])).toEqual(true)
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['project!=non-existing'])).toEqual(true)
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['non-existing-key!=firebase,resource!=vercel'])).toEqual(true)
    })
  })

  describe('no matches', () => {
    it('should not have a match', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['other-fake-tags'])).toEqual(false)
    })

    it('should not match with "=" condition', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource=firebase'])).toEqual(false)
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['non-existing-key=firebase'])).toEqual(false)
    })

    it('should not match with "!=" condition', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['size!=big'])).toEqual(false)
    })
  })

  describe('and condition', () => {
    it('should match', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource=vercel,resource=fake'])).toEqual(true)
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource=vercel,resource!=not-exist'])).toEqual(true)
    })

    it('should not match', () => {
      expect(hasOneOfRequiredTags('fake-project', projectTags, ['resource=vercel,resource=not-exist'])).toEqual(false)
    })
  })
})
