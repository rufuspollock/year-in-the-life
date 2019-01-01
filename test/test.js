var fs = require('fs');
var assert = require('assert');

var extractor = require('../src/calendar-parse.js');

var localPath = 'test/events.ics'

describe('Calendar event extractor', function() {
  describe('extract', function() {
    var loaded = fs.readFileSync(localPath, 'utf8');
    var out = extractor.extract(loaded);

    it('dates work', function() {
      assert.equal(out[0].start, '2018-12-07');
      assert.equal(out[0].end, '2018-12-17');
    });

    it('rest works', function() {
      assert.equal(out[0].hashtag, 'Art');
      assert.equal(out[0].who, 'sylvie');
      assert.equal(out[0].location, 'venice');
      assert.equal(out[0].what, 'performance');
    });
  });

  describe('parseDescription', function() {
    var in_ = 'Do ABC @london ~rufus #LM';
    var out = extractor.parseDescription(in_);

    it('location is correct', function() {
      assert.equal(out.location, 'london');
    });

    it('who is correct', function() {
      assert.equal(out.who, 'rufus');
    });

    it('hashtag is correct', function() {
      assert.equal(out.hashtag, 'LM');
    });

    it('summary is correct', function() {
      assert.equal(out.what, 'Do ABC');
    });
  });
});

