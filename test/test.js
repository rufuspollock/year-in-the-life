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
      assert.equal(out[0].where, 'venice');
      assert.equal(out[0].what, 'performance');
    });
  });

  describe('parseDescription', function() {
    var in_ = 'Do ABC @london ~rufus #LM';
    var out = extractor.parseDescription(in_);

    it('where is correct', function() {
      assert.equal(out.where, 'london');
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

describe('filterCalendarData', function() {
  inData = [
    { who: 'sylvie', what: 'in florence' },
    { who: 'rufus', what: 'viderum sprint' },
    { who: 'Both', what: 'On holiday' }
  ];

  it('works with a who', function() {
    exp = [
      inData[0],
      inData[2]
    ]
    var out = extractor.filterCalendarData(inData, 'sylvie');
    assert.deepEqual(out, exp);
  });

  it('works with a no who', function() {
    var out = extractor.filterCalendarData(inData);
    assert.deepEqual(inData, out);
  });
});

describe('Make heatmap data', function() {
  it('works', function() {
    inData = [
      {
        start: '2018-02-03',
        end: '2018-02-20',
        what: 'On holiday',
        where: 'lisbon',
        status: ''
      }
    ]
    var out = extractor.convertCalendarToHeatmapData('2018-01-01', '2019-01-01', inData);
    assert.equal(Object.keys(out).length, 365);
    assert.equal(out['2018-02-04'].title, 'lisbon - On holiday ');
  });
});

describe('date stuff', function() {
  it('dateRange', function() {
    var out = extractor.dateRange('2018-01-01', '2019-01-01');
    assert.equal(out.length, 365);
    assert.equal(out[0].toISOString().slice(0,10), '2018-01-01');
    assert.equal(out[90].toISOString().slice(0,10), '2018-04-01');
    assert.equal(out[364].toISOString().slice(0,10), '2018-12-31');
  });

  it('dateRange with no end date', function() {
    var out = extractor.dateRange('2018-03-31');
    assert.equal(out.length, 1);
    assert.equal(out[0].toISOString().slice(0,10), '2018-03-31');
  });

});
