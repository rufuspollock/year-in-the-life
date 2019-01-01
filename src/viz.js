var config = {
  cellInnerSize: 11,
  cellPadding: 2
};

var locale = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  No: 'No',
  on: 'on',
  Less: 'Less',
  More: 'More'
};

function draw(chartData, startDate, endDate, selector='.container') {
  var startDate = moment.utc(startDate);

  // 52 weeks ...
  var cellSize = config.cellInnerSize + config.cellPadding;
  var width = 59 + 53 * cellSize;
  var MONTH_LABEL_PADDING = 6;
  var height = 8 * cellSize;
  height = 110;
  var max = 1;

  var svg = d3.select(selector)
    .style('position', 'relative')
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr('class', 'calendar-heatmap')
    .append("g")
      .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

  var dateRange = d3.utcDays(startDate, endDate); 
  var rect = svg.append("g")
      .attr("fill", "none")
    .selectAll("rect")
    // TODO: support dates starting at any time
    .data(function(d) { return dateRange; })
    .enter().append("rect")
      .attr('class', 'day-cell')
      .attr("width", config.cellInnerSize)
      .attr("height", config.cellInnerSize)
      .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
      .attr("y", function(d) { return MONTH_LABEL_PADDING + d.getDay() * cellSize; })
      .datum(d3.timeFormat("%Y-%m-%d"));

  rect.filter(function(d) { return d in chartData; })
      .attr("fill", function(d) {
        return chartData[d].color;
      })
    .append("title")
      .text(function(d) {
        return d + ": " + chartData[d].title;
      });

  // ----------
  // Labels and decoration

  var monthRange = d3.utcMonths(startDate.startOf('month').toDate(), endDate); // it ignores the first month if the 1st date is after the start of the month
  var monthLabels = svg.selectAll('.month')
      .data(monthRange)
      .enter().append('text')
      .attr('class', 'month-name')
      .text(function (d) {
        return locale.months[d.getMonth()];
      })
      .attr('x', function (d, i) {
        var matchIndex = 0;
        dateRange.find(function (element, index) {
          matchIndex = index;
          return moment.utc(d).isSame(element, 'month') && moment.utc(d).isSame(element, 'year');
        });

        return Math.floor(matchIndex / 7) * cellSize + cellSize;
      })
      .attr('y', 0);  // fix these to the top

  locale.days.forEach(function (day, index) {
    if (index % 2) {
      svg.append('text')
        .attr('class', 'day-initial')
        .attr('transform', 'translate(-8,' + cellSize * (index + 1) + ')')
        .style('text-anchor', 'middle')
        .attr('dy', '2')
        .text(day);
    }
  });

  // show the months with a line
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
    .selectAll("path")
    .data(function(d) { return d3.timeMonths(startDate, endDate); })
    .enter().append("path")
      .attr("d", pathMonth);

  function pathMonth(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + (d0 * cellSize + MONTH_LABEL_PADDING)
        + "H" + w0 * cellSize + "V" + (7 * cellSize + MONTH_LABEL_PADDING)
        + "H" + w1 * cellSize + "V" + ((d1 + 1) * cellSize + MONTH_LABEL_PADDING)
        + "H" + (w1 + 1) * cellSize + "V" + MONTH_LABEL_PADDING
        + "H" + (w0 + 1) * cellSize + "Z";
  }
}

/*
function duringAnEvent(date) {
  for(let event of events) {
    if (date >= event.start && date <= event.end) {
      return true
    }
  }
  return false
}
*/

