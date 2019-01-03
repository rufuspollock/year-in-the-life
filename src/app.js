var startDate = '2019-01-01';
var endDate = '2020-01-01';

var icalUrl = 'https://calendar.google.com/calendar/ical/artearthtech.com_r63nmilujsalhfgcq2bj2j3vmc%40group.calendar.google.com/private-a2ad4dd990cdf0598860a29f0b603e46/basic.ics'

document.addEventListener("DOMContentLoaded", function(event) {
  var tmpUrl = 'https://cors.io/?' + icalUrl;
  // var tmpUrl = '/src/me/calendar/data/events-both.ics';
  axios.get(tmpUrl, { crossdomain: true })
    .then(function (response) {
      renderIt(response.data);
    });
});

function renderIt(icalData) {
  var calendarData = module.extract(icalData);
  var personsData = ['rufus', 'sylvie'].map(person => {
    var tmpData = module.filterCalendarData(calendarData, person);
    var chartData = module.convertCalendarToHeatmapData(tmpData, startDate, endDate);
    for (let evt of Object.values(chartData)) {
      titleize(evt);
      colorize(evt);
    }
    return chartData;
  });

  personsData.forEach(chartData => {
    drawHeatmap(chartData, startDate, endDate);
  });

  personsData.forEach(chartData => {
    drawSwim(chartData, startDate, endDate);
  });
}

// given events, startDate, endDate, colorize and titleize produce data for mapping which is a dict keyed by date with color, title, and text attributes

var hashColorMap = {
  'personal': '#EA70AF',
  'holiday': '#EA70AF',
  'vacation': '#EA70AF',
  'aet': '#40C9A2',
  'lm': '#2391C4',
  // orange
  // 'work': '#EF6F1A'
  'work': '#565656'
}

function colorize(evt) {
  var noEvent = '#EAEAEA',
    eventColor = '#F7EAAA'
    ;

  evt.color = evt.raw ? eventColor : noEvent;

  // sundays are reserved - not any more!
  if (moment.utc(evt.date).isoWeekday() == 7) {
    // evt.color = 'pink'
  }

  var hash = evt.hashtag ? evt.hashtag.toLowerCase() : '';
  evt.color = (hash in hashColorMap) ? hashColorMap[hash] : evt.color;

  if (evt.status && evt.status.includes('?')) {
    evt.color = 'orange';
  } else if (evt.what && evt.what.includes('holiday')) {
    evt.color = 'violet';
  } else if (evt.what && evt.what.includes('personal sprint')) {
    evt.color = 'red';
  }
}

function colorizeLocation(evt) {
  if (evt.where && evt.where.includes('lacheraille')) {
    evt.color = 'blue';
  }
}

function titleize(evt) {
  evt.title = evt.raw ? `${evt.raw}` : '';
  if (evt.raw && evt.raw.includes('[tbc]')) {
    evt.text = '?'
  }
}

