require('should')

const { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay, isEntityId, isItemId, isPropertyId, isLexemeId, isFormId, isSenseId, isGuid, isNumericId, getNumericId, getImageUrl } = require('../lib/helpers/helpers')

const Q970917 = require('./data/Q970917.json')

describe('helpers', () => {
  const ISOtime = '2014-05-14T00:00:00.000Z'
  const wdTime = '+2014-05-14T00:00:00Z'
  const epoch = 1400025600000
  const ISOnegativeTime = '-000044-03-15T00:00:00.000Z'
  const negativeWdTime = '-0044-03-15T00:00:00Z'
  const negativeEpoch = -63549360000000

  describe('wikibaseTimeToEpochTime', () => {
    it('env', done => {
      new Date(epoch).toISOString().should.equal(ISOtime)
      new Date(negativeEpoch).toISOString().should.equal(ISOnegativeTime)
      done()
    })

    it('should return a number (epoch time)', done => {
      wikibaseTimeToEpochTime(wdTime).should.be.a.Number()
      done()
    })

    it('should return a number for negative time', done => {
      wikibaseTimeToEpochTime(negativeWdTime).should.be.a.Number()
      done()
    })

    it('should return the right number', done => {
      wikibaseTimeToEpochTime(wdTime).should.equal(epoch)
      done()
    })

    it('should return the right number for negative time too', done => {
      wikibaseTimeToEpochTime(negativeWdTime).should.equal(negativeEpoch)
      done()
    })

    it('should accept a value object', done => {
      wikibaseTimeToEpochTime(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal(-3160944000000)
      wikibaseTimeToEpochTime(Q970917.claims.P569[1].mainsnak.datavalue.value)
      .should.equal(657417600000)
      wikibaseTimeToEpochTime(Q970917.claims.P569[2].mainsnak.datavalue.value)
      .should.equal(631152000000)
      done()
    })
  })

  describe('wikibaseTimeToISOString', () => {
    it('should convert wikibase date to ISO date', done => {
      wikibaseTimeToISOString('+1885-05-22T00:00:00Z')
      .should.equal('1885-05-22T00:00:00.000Z')

      wikibaseTimeToISOString('+0180-03-17T00:00:00Z')
      .should.equal('0180-03-17T00:00:00.000Z')

      wikibaseTimeToISOString('-0398-00-00T00:00:00Z')
      .should.equal('-000398-01-01T00:00:00.000Z')

      wikibaseTimeToISOString('-34000-00-00T00:00:00Z')
      .should.equal('-034000-01-01T00:00:00.000Z')

      wikibaseTimeToISOString('+34000-00-00T00:00:00Z')
      .should.equal('+034000-01-01T00:00:00.000Z')

      done()
    })

    it('should return a valid time for possible invalid dates', done => {
      wikibaseTimeToISOString('+1953-00-00T00:00:00Z')
      .should.equal('1953-01-01T00:00:00.000Z')

      wikibaseTimeToISOString('+1953-11-00T00:00:00Z')
      .should.equal('1953-11-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time even for possible invalid negative date', done => {
      wikibaseTimeToISOString('-1953-00-00T00:00:00Z')
      .should.equal('-001953-01-01T00:00:00.000Z')

      wikibaseTimeToISOString('-1953-11-00T00:00:00Z')
      .should.equal('-001953-11-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time for dates far in the past', done => {
      wikibaseTimeToISOString('-13798000000-00-00T00:00:00Z')
      .should.equal('-13798000000-01-01T00:00:00Z')

      wikibaseTimeToISOString('-13798000000-02-00T00:00:00Z')
      .should.equal('-13798000000-02-01T00:00:00Z')

      wikibaseTimeToISOString('-13798000000-02-07T15:00:00Z')
      .should.equal('-13798000000-02-07T15:00:00Z')
      done()
    })

    it('should return a valid time for dates far in the future', done => {
      wikibaseTimeToISOString('+13798000000-00-00T00:00:00Z')
      .should.equal('+13798000000-01-01T00:00:00Z')

      wikibaseTimeToISOString('+13798000000-02-00T00:00:00Z')
      .should.equal('+13798000000-02-01T00:00:00Z')

      wikibaseTimeToISOString('+13798000000-02-07T15:00:00Z')
      .should.equal('+13798000000-02-07T15:00:00Z')
      done()
    })

    it('should accept a value object', done => {
      wikibaseTimeToISOString(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal('1869-11-01T00:00:00.000Z')
      wikibaseTimeToISOString(Q970917.claims.P569[1].mainsnak.datavalue.value)
      .should.equal('1990-11-01T00:00:00.000Z')
      wikibaseTimeToISOString(Q970917.claims.P569[2].mainsnak.datavalue.value)
      .should.equal('1990-01-01T00:00:00.000Z')
      done()
    })
  })

  describe('wikibaseTimeToSimpleDay', () => {
    it('should convert wikibase date with year precision to simple-day', done => {
      wikibaseTimeToSimpleDay('+1953-00-00T00:00:00Z').should.equal('1953')
      wikibaseTimeToSimpleDay('-1953-00-00T00:00:00Z').should.equal('-1953')
      wikibaseTimeToSimpleDay('+13-00-00T00:00:00Z').should.equal('13')
      wikibaseTimeToSimpleDay('-13-00-00T00:00:00Z').should.equal('-13')
      wikibaseTimeToSimpleDay('-0100-00-00T00:00:00Z').should.equal('-100')
      done()
    })

    it('should convert wikibase date with month precision to simple-day', done => {
      wikibaseTimeToSimpleDay('+1953-01-00T00:00:00Z').should.equal('1953-01')
      wikibaseTimeToSimpleDay('-1953-01-00T00:00:00Z').should.equal('-1953-01')
      wikibaseTimeToSimpleDay('+13-01-00T00:00:00Z').should.equal('13-01')
      wikibaseTimeToSimpleDay('-13-01-00T00:00:00Z').should.equal('-13-01')
      wikibaseTimeToSimpleDay('-0044-03-00T00:00:00Z').should.equal('-44-03')
      done()
    })

    it('should convert wikibase date with day precision or finer to simple-day', done => {
      wikibaseTimeToSimpleDay('+1953-01-01T00:00:00Z').should.equal('1953-01-01')
      wikibaseTimeToSimpleDay('-1953-01-01T00:00:00Z').should.equal('-1953-01-01')
      wikibaseTimeToSimpleDay('+1953-01-01T13:45:00Z').should.equal('1953-01-01')
      wikibaseTimeToSimpleDay('-1953-01-01T13:45:00Z').should.equal('-1953-01-01')
      wikibaseTimeToSimpleDay('-0044-03-01T00:00:00Z').should.equal('-44-03-01')
      done()
    })

    it('should accept a value object', done => {
      wikibaseTimeToSimpleDay(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal('1869-11')
      done()
    })
  })

  describe('isEntityId', () => {
    it('should accept all supported entity types ids', done => {
      isEntityId('Q571').should.be.true()
      isEntityId('P31').should.be.true()
      isEntityId('L525').should.be.true()
      isEntityId('L525-F1').should.be.true()
      isEntityId('L525-S1').should.be.true()
      isEntityId('L525-Z1').should.be.false()
      isEntityId('31').should.be.false()
      isEntityId(31).should.be.false()
      isEntityId('Z31').should.be.false()
      isEntityId('q31').should.be.false()
      isEntityId('p31').should.be.false()
      done()
    })
  })

  describe('isItemId', () => {
    it('should accept item ids', done => {
      isItemId('Q571').should.be.true()
      isItemId('P31').should.be.false()
      isItemId('31').should.be.false()
      isItemId(31).should.be.false()
      isItemId('Z31').should.be.false()
      isItemId('q31').should.be.false()
      isItemId('p31').should.be.false()
      done()
    })
  })

  describe('isPropertyId', () => {
    it('should accept property ids', done => {
      isPropertyId('P31').should.be.true()
      isPropertyId('Q571').should.be.false()
      isPropertyId('31').should.be.false()
      isPropertyId(31).should.be.false()
      isPropertyId('Z31').should.be.false()
      isPropertyId('q31').should.be.false()
      isPropertyId('p31').should.be.false()
      done()
    })
  })

  describe('isLexemeId', () => {
    it('should accept lexeme ids', done => {
      isLexemeId('L525').should.be.true()
      isLexemeId('P31').should.be.false()
      isLexemeId('Q571').should.be.false()
      isLexemeId('31').should.be.false()
      isLexemeId(31).should.be.false()
      isLexemeId('Z31').should.be.false()
      isLexemeId('q31').should.be.false()
      isLexemeId('p31').should.be.false()
      done()
    })
  })

  describe('isFormId', () => {
    it('should accept form ids', done => {
      isFormId('L525-F1').should.be.true()
      isFormId('L525').should.be.false()
      isFormId('L525F1').should.be.false()
      isFormId('L525-S1').should.be.false()
      done()
    })
  })

  describe('isSenseId', () => {
    it('should accept sense ids', done => {
      isSenseId('L525-S1').should.be.true()
      isSenseId('L525').should.be.false()
      isSenseId('L525S1').should.be.false()
      isSenseId('L525-F1').should.be.false()
      done()
    })
  })

  describe('isGuid', () => {
    it('should accept guids for all supported entities types', done => {
      isGuid('q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C').should.be.true()
      isGuid('Q520$91F0CCEA-19E4-4CEB-97D9-74B014C14686').should.be.true()
      isGuid('q520$7f95c04f-4cb6-b018-80eb-fefe0e0bf377').should.be.true()
      isGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec6').should.be.true()
      isGuid('L525$faeae005-4b75-1319-5516-e08a8bdd0e9c').should.be.true()
      isGuid('L525-F2$52c9b382-02f5-4413-9923-26ade74f5a0d').should.be.true()
      isGuid('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48').should.be.true()
      isGuid('P6216$a7fd6230-496e-6b47-ca4a-dcec5dbd7f95').should.be.true()
      isGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec').should.be.false()
      isGuid('Q520').should.be.false()
      done()
    })
  })

  describe('isNumericId', () => {
    it('should accept numeric ids', () => {
      isNumericId('1').should.be.true()
      isNumericId('Q1').should.be.false()
    })
  })

  describe('getNumericId', () => {
    it('should get a numeric id from an entity id', () => {
      getNumericId('Q1').should.equal('1')
      getNumericId('P1').should.equal('1')
      getNumericId('L1').should.equal('1')
      getNumericId.bind(null, 'L1-F1').should.throw()
      getNumericId.bind(null, 'L1-S1').should.throw()
    })
  })

  describe('getImageUrl', () => {
    it('should build a commons FilePath Url', done => {
      getImageUrl('Peredot.jpg')
      .should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg')

      getImageUrl('Peredot.jpg', 250)
      .should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg?width=250')
      done()
    })
  })
})
