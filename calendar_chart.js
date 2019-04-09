// Calendar from Alternative Calendar View http://bl.ocks.org/KathyZ/c2d4694c953419e0509b 
const cellSize = 19;
var day = d3.timeFormat("%w"), // day of the week
  day_of_month = d3.timeFormat("%e"), // day of the month
  day_of_year = d3.timeFormat("%j"),
  week = d3.timeFormat("%U"), // week number of the year
  month = d3.timeFormat("%m"), // month number
  year = d3.timeFormat("%Y"),
  format = d3.timeFormat("%Y-%m-%d");
let width = 750;
let no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
var shift_up = cellSize * 3;
let colorScheme = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, 5]);
let rect;
let tooltip = d3.select("body")
  .append("div").attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");

function makeTitle(chart) {
  let month_titles = chart.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
    .data(function (d) {
      return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("text")
    .text(monthTitle)
    .attr("x", function (d, i) {
      var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
      return month_padding;
    })
    .attr("y", function (d, i) {
      var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
      var row_level = Math.ceil(month(d) / (no_months_in_a_row));
      return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize - shift_up;
    })
    .attr("class", "month-title")
    .attr("d", monthTitle);

  let year_titles = chart.selectAll(".year-title")
    .data(function (d) {
      return d3.timeYears(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("text")
    .attr("x", function (d, i) { return width / 2 - 100; })
    .attr("y", function (d, i) { return cellSize * 5.5 - shift_up; })
    .text(yearTitle)
    .attr("class", "year-title")
    .attr("d", yearTitle);

  function monthTitle(t0) {
    return t0.toLocaleString("en-us", { month: "long" });
  }
  function yearTitle(t0) {
    return t0.toString().split(" ")[3];
  }
}

function updateTooltip(company) {
  //  Tooltip
  rect.on("mouseover", mouseover);
  rect.on("click", external_link);
  rect.on("mouseout", mouseout);

  function mouseover(d) {
    tooltip.style("visibility", "visible");
    let width;
    let str = "Date: " + d;
    if (company_news[company][d] !== undefined) {
      let headline = "<br>Headline: " + company_news[company][d]["headline"];
      let desc = "<br>Description: " + company_news[company][d]["short description"];
      desc = desc.substring(0, substring_length) + "...";
      str += headline + desc;
      width = "40%"
    }
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(str)
      .style("left", (d3.event.pageX) + 30 + "px")
      .style("width", width)
      .style("top", (d3.event.pageY) + "px");
  }

  function mouseout() {
    tooltip.style("visibility", "hidden");
  }

  function external_link(d) {
    if (company_news[company][d] !== undefined)
      window.open(company_news[company][d]["link"], "_blank");
  }

}

function updateChart(data, company, category) {
  let company_name = company.charAt(0).toUpperCase() + company.substring(1);

  d3.select("div#title").select("h1").text("Average Review Ratings of " + company_name)

  d3.select("svg").attr("id", company + " " + category);
  rect.style("fill", "none");
  rect.filter(function (d) { return d.toString() in data[company]; })
    .style("fill", function (d) { return colorScheme(data[company][d][category + " Average"]); })
    .style("stroke", function (d) {
      if (company_news[company_name][d] !== undefined)
        return "black";
      return "#ccc";
    })

    .select("title")
    .text(function (d) { return d + ": " + data[company][d][category + " Average"]; });

  updateTooltip(company_name);
}

function updateYear(data, y) {
  let id = d3.select("svg").attr("id").split(" ");
  let company = id[0];
  let category = id[1];

  d3.select("#chart").selectAll("svg").remove();
  chart = d3.select("#chart").selectAll("svg")
    .data([y])
    .enter()
    .append("svg")
    .attr("class", "calendar")
    .append("g");

  makeTitle(chart);

  rect = chart.selectAll(".day")
    .data(function (d) {
      return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function (d) {
      var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
      return day(d) * cellSize + month_padding;
    })
    .attr("y", function (d) {
      var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
      var row_level = Math.ceil(month(d) / (no_months_in_a_row));
      return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize / 2 - shift_up;
    })
    .datum(format);

  updateChart(data, company, category);
}