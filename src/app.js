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
  for (let person of ['rufus', 'sylvie']) {
    var tmpData = module.filterCalendarData(calendarData, person);
    var chartData = module.convertCalendarToHeatmapData(startDate, endDate, tmpData);
    draw(chartData, startDate, endDate);
  }
}

