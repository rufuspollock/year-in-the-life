// var ical = require('../vendor/ical.js')
var icsToJson = require('ics-to-json').default;

// convert 20180708 to 2017-07-08
function dateWithDashes(inDate) {
  var year = inDate.slice(0,4);
  var month = inDate.slice(4,6);
  var day = inDate.slice(6,8);
  return `${year}-${month}-${day}`;
}

function extract(calendarString) {
  var parsed = icsToJson(calendarString);
  var results = parsed.map(evt => {
    var res = {
      start: dateWithDashes(evt.startDate),
      end: dateWithDashes(evt.endDate)
    };
    var res = Object.assign({}, res, parseDescription(evt.summary));
    return res;
  });
  return results;
}

// Working at ABC ~rufus #work @london
// Also allow for ~ rufus
function parseDescription(string) {
  var tmp = string.replace('~ ', '~');

  var result = {
    raw: string,
    what: '',
    location: '',
    hashtag: '',
    who: ''
  };

  var whoRegex = new RegExp('~([^~ ]+) ?');
  var match1 = tmp.match(whoRegex);
  if (match1) {
    result.who = match1[1];
  }


  var locationRegex = new RegExp('@([^@ ]+)');
  var m2 = tmp.match(locationRegex);
  if (m2) {
    // St Tropez is @st-tropez
    result.location= m2[1].replace('-', ' ');
  }

  var locationRegex = new RegExp('@([^@ ]+)');
  var m2 = tmp.match(locationRegex);
  if (m2) {
    // St Tropez is @st-tropez
    result.location= m2[1].replace('-', ' ');
  }

  // TODO: could be multiple hashtags??
  var hashRegex = new RegExp('#([^# ]+)');
  var m3 = tmp.match(hashRegex);
  if (m3) {
    result.hashtag = m3[1];
  }

  var what = tmp.replace(whoRegex, '')
    .replace(locationRegex, '')
    .replace(hashRegex, '')
    .trim()
    ;

  result.what = what;

  return result;
}

module.exports = {
  extract: extract,
  parseDescription: parseDescription
}

