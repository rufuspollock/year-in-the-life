var startDate = moment.utc('2018-01-01');
var endDate = moment.utc('2019-01-01');

d3.csv('data/events-2018-rufus.csv', function(error, csv) {
  if (error) throw error;
  var chartData = processCsvRows(csv);
  draw(chartData, startDate, endDate);
})

d3.csv('data/events-2018-sylvie.csv', function(error, csv) {
  if (error) throw error;
  var chartData = processCsvRows(csv);
  draw(chartData, startDate, endDate);
})

// process csv rows to add colors etc based on location, activity etc
function processCsvRows(csv) {
  var chartData = {};
  d3.utcDays(startDate, endDate).map(function (dateElement) {
    dateElement = moment.utc(dateElement);
    var color = '#d9d9d9';
    // sundays are reserved
    if (dateElement.isoWeekday() == 7) {
      color = 'pink'
    }
    chartData[moment(dateElement).toISOString().slice(0,10)] = {
      color: color,
      title: ''
    };
  });

  for(let row of csv) {
    var day = moment.utc(row.start);
    while(day <= moment.utc(row.end) && row.end) {
      if (row.status.includes('?')) {
        row.color = 'orange';
      } else if (row.where.includes('lacheraille')) {
        row.color = 'blue';
      } else if (row.what.includes('holiday')) {
        row.color = 'violet';
      } else if (row.what.includes('personal sprint')) {
        row.color = 'red';
      } else {
        row.color = 'rgb(73, 153, 151)';
      }
      row.title = `${row.where} - ${row.what} ${row.status}`;
      chartData[day.toISOString().slice(0,10)] = row;
      day = day.add(1, 'day')
    }
  }
  return chartData;
}

