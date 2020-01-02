// var ical = require('../vendor/ical.js')
const icsToJson = require('ics-to-json').default;
const moment = require('moment');

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

// Parse a calendar title/summary string into structured data
//
// Strings are like: "Working at ABC ~rufus #work @london"
// Also allow for spaces after ~ e.g. "~ rufus"
function parseDescription(string) {
  var tmp = string.replace('~ ', '~');

  var result = {
    raw: string,
    what: '',
    where: '',
    hashtag: '',
    who: '',
    status: ''
  };

  var whoRegex = new RegExp('~([^~ ]+) ?');
  var match1 = tmp.match(whoRegex);
  if (match1) {
    result.who = match1[1];
  }


  var whereRegex = new RegExp('@([^@ ]+)');
  var m2 = tmp.match(whereRegex);
  if (m2) {
    // St Tropez is @st-tropez
    result.where= m2[1].replace('-', ' ');
  }

  var whereRegex = new RegExp('@([^@ ]+)');
  var m2 = tmp.match(whereRegex);
  if (m2) {
    // St Tropez is @st-tropez
    result.where= m2[1].replace('-', ' ');
  }

  // TODO: could be multiple hashtags??
  var hashRegex = new RegExp('#([^# ]+)');
  var m3 = tmp.match(hashRegex);
  if (m3) {
    result.hashtag = m3[1];
  }

  var what = tmp.replace(whoRegex, '')
    .replace(whereRegex, '')
    .replace(hashRegex, '')
    .trim()
    ;

  result.what = what;

  return result;
}

// Deep clone then filter ...
const filterCalendarData = function(calData, who) {
  var out = calData.map(evt => {
    return Object.assign({}, evt);
  });
  var out = out.filter(evt => {
    mywho = ('' || evt.who).toLowerCase();
    return (!mywho || mywho == 'both' || mywho == who);
  });
  return out;
}

function isoDate(date) {
  return date.toISOString().slice(0,10);
}

// calendar heatmap data
// a dict indexed by date
// { date: { color: ..., title: ..., other event data if present ...} }
// dates are ISO format strings ...
function convertCalendarToHeatmapData(calendarData, startDate, endDate) {
  // create full date range and assign default structure
  var chartData = {};
  dateRange(startDate, endDate).forEach(dateElement => {
    chartData[isoDate(dateElement)] = {
      color: 'white',
      title: '',
      date: isoDate(dateElement)
    };
  });

  // now set with event data we have ...
  var start = moment.utc(startDate);
  for(let row of calendarData) {
    dateRange(row.start, row.end).forEach(day => {
      if (day >= start) {
        chartData[isoDate(day)] = Object.assign({ color: 'white', title: ''}, row);
      }
    });
  }
  return chartData;
}

// Get list of dates between two dates
// TODO: what should happen if start and end are the same
function dateRange(startDate, endDate) {
  var dateArr = [];
  var start = moment.utc(startDate);
  var end = endDate ? moment.utc(endDate) : moment.utc(start).add(1, 'd');

  while(start < end){
    dateArr.push(moment.utc(start));
    start = start.add(1, 'days');
  }
  return dateArr;
}

module.exports = {
  extract: extract,
  parseDescription: parseDescription,
  convertCalendarToHeatmapData: convertCalendarToHeatmapData,
  dateRange: dateRange,
  filterCalendarData: filterCalendarData
}

