// Buttons for categories and companies
const widthLegend = 300;
const heightLegend = 25;

function makeButtons(data, yearMin, yearMax) {
  d3.select("#companies").selectAll(".img_button")
    .data(companies)
    .enter()
    .append("input")
    .attr("type", "image")
    .attr("class", "img_button")
    .attr("src", function (d) { return "img/" + d + ".png" })
    .attr("text", function (d) { return d })
    .attr("width", 90)
    .on("click", (d) => {
      let id = d3.select("svg").attr("id").split(" ");
      let category = id[1];
      updateChart(data, d, category);
    });

  d3.select("#categories").selectAll(".category_button")
    .data(categories)
    .enter()
    .append("input")
    .attr("type", "button")
    .attr("class", "category_button")
    .attr("value", function (d) { return d })
    .on("click", (d) => {
      let id = d3.select("svg").attr("id").split(" ");
      let company = id[0];
      updateChart(reviews_by_date_avg, company, d);
    });

  // Input range for year
  let div = d3.select("#year").append("div").style("padding-left", 10).style("margin-right", 70)

  div.append("input")
    .attr("type", "range")
    .attr("min", yearMin)
    .attr("max", yearMax)
    .attr("step", 1)
    .attr("value", 2018)
    .attr("class", "slider")
    .on("input", function () {
      updateYear(data, Number(this.value));
    });

  let input_svg = div.append("svg").attr("height", 20)
  input_svg.append("text")
    .attr("y", 20)
    .text(yearMin);

  input_svg.append("text")
    .attr("x", 150)
    .attr("y", 20)
    .text(yearMax);

  let svg = d3.select("#legend").append("svg").style("padding-left", 15)
    .attr("width", widthLegend)
    .attr("height", heightLegend * 2);

  var linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "linear-gradient");

  let color_array = [];

  for (let i = 0; i <= 5; i++) {
    color_array.push(colorScheme(i));
  }
  const legendScale = d3.scaleLinear().domain([0, 5]).range([0, svg.attr("width")]);
  const legendAxis = d3.axisBottom(legendScale);

  linearGradient.selectAll("stop")
    .data(color_array)
    .enter().append("stop")
    .attr("offset", function (d, i) { return i * 0.2; })
    .attr("stop-color", function (d) { return d; });

  svg.append("rect")
    .style("fill", "url(#linear-gradient)")
    .attr("width", widthLegend)
    .attr("height", heightLegend)

  svg.append("g")
    .attr("transform", "translate (0," + heightLegend + ")")
    .call(legendAxis);
}