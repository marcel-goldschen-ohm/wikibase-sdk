const should = require('should')
const qs = require('querystring')
const sinceYesterdayInMilliSeconds = new Date().getTime() - 24 * 60 * 60 * 1000
const sinceYesterdayInSeconds = Math.trunc(sinceYesterdayInMilliSeconds / 1000)

const { buildUrl } = require('./lib/tests_env')
const getRevisions = require('../lib/queries/get_revisions')(buildUrl)

describe('getRevisions', () => {
  it('should reject invalid ids', done => {
    getRevisions.bind(null, 'foo').should.throw('invalid entity page title: foo')
    done()
  })

  it('should accept namespaced ids invalid ids', done => {
    getRevisions.bind(null, 'Item:Q123').should.not.throw()
    getRevisions.bind(null, 'Property:P123').should.not.throw()
    getRevisions.bind(null, 'Lexeme:L123').should.not.throw()
    getRevisions.bind(null, 'Property:Q123').should.throw('invalid entity page title: Property:Q123')
    done()
  })

  it('should return a revision query url', done => {
    const url = getRevisions('Q3548931')
    url.should.be.a.String()
    const query = qs.parse(url.split('?')[1])
    query.action.should.equal('query')
    query.prop.should.equal('revisions')
    query.titles.should.equal('Q3548931')
    query.rvlimit.should.equal('max')
    query.format.should.equal('json')
    done()
  })

  it('should accept several ids', done => {
    const url = getRevisions([ 'Q3548931', 'Q3548932' ])
    const query = qs.parse(url.split('?')[1])
    query.titles.should.equal('Q3548931|Q3548932')
    done()
  })

  it('should accept custom parameters', done => {
    const url = getRevisions('Q3548931', { limit: 2, start: sinceYesterdayInSeconds })
    const query = qs.parse(url.split('?')[1])
    query.rvlimit.should.equal('2')
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept time in milliseconds', done => {
    const url = getRevisions('Q3548931', { start: sinceYesterdayInMilliSeconds })
    const query = qs.parse(url.split('?')[1])
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept time in ISO format', done => {
    const ISOtime = new Date(sinceYesterdayInMilliSeconds).toISOString()
    const url = getRevisions('Q3548931', { end: ISOtime })
    const query = qs.parse(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept date objects in ISO format', done => {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions('Q3548931', { end: dateObj })
    const query = qs.parse(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should ignore parameters that the API refuses for multiple ids', done => {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions([ 'Q3548931', 'Q3548932' ], { end: dateObj })
    const query = qs.parse(url.split('?')[1])
    should(query.rvend).not.be.ok()
    done()
  })

  it('should allow to set rvprop as a string', () => {
    const url = getRevisions('Q3548931', { prop: 'tags|user' })
    const query = qs.parse(url.split('?')[1])
    query.rvprop.should.equal('tags|user')
  })

  it('should allow to set rvprop as an array', () => {
    const url = getRevisions('Q3548931', { prop: [ 'tags', 'user' ] })
    const query = qs.parse(url.split('?')[1])
    query.rvprop.should.equal('tags|user')
  })

  it('should allow to set rvuser', () => {
    const url = getRevisions('Q3548931', { user: 'foo' })
    const query = qs.parse(url.split('?')[1])
    query.rvuser.should.equal('foo')
  })

  it('should allow to set rvexcludeuser', () => {
    const url = getRevisions('Q3548931', { excludeuser: 'foo' })
    const query = qs.parse(url.split('?')[1])
    query.rvexcludeuser.should.equal('foo')
  })

  it('should allow to set rvtag', () => {
    const url = getRevisions('Q3548931', { tag: 'foo' })
    const query = qs.parse(url.split('?')[1])
    query.rvtag.should.equal('foo')
  })
})
