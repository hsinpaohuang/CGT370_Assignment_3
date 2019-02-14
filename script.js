var width = 960,
    height = 500,
    centered;

var projection = d3.geoAlbersUsa()
    .scale(6000)
    .translate([-600, 400]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

//color scale
var data = d3.map();
var colorScheme = d3.schemeReds[5];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([0, 5001, 10001, 15001, 20001])
    .range(colorScheme);

//legend
d3.select('body')
	.append('div')
	.attr('class', 'legend')
	.append('h3')
	.text("Legend")
d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'zero')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[1])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'zerot')
	.text('0-5000')

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'fiveK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[2])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'fivekt')
	.text('5001-10000')
	
d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'tenK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[3])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'tenkt')
	.text('10001-15000');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'fifteenK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[4])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'fifteenkt')
	.text('15001-20000');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'twentyK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[5])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'twentykt')
	.text('20001+');

//county info
d3.select('body')
	.append('div')
	.attr('id', 'info')
	.append('p')

//data
d3.queue()
    .defer(d3.json, "indiana.json")
    .defer(d3.csv, "poverty_status.csv", function(d) { data.set(d.geoid, +d.est); })
    .await(ready);

function ready(error, us) {
    if (error) throw error;

    // Draw the map
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.cb_2015_indiana_county_20m).features)
        .enter()
		.append("path")
		.attr("data-legend",function(d) { return d.properties.NAME; })
        .attr("fill", function (d){
		// Pull data for this county
		d.est = data.get(d.properties.GEOID);
		// Set the color
		return colorScale(d.est);
        })
        .attr("d", path)
		.text(function(d) { return d.properties.NAME; })
		.on("click", clicked);
	svg.append("path")
		.datum(topojson.mesh(us, us.objects.cb_2015_indiana_county_20m, function(a, b) { return a !== b; }))
		.attr("id", "countyBorders")
		.attr("d", path);
}

function clicked(d)
{
	console.log("clicked on: " + d.properties.NAME + ", estimated number of people in poverty: " + d.est);
	d3.select('div.info>p')
		.text(d.properties.NAME + ': ' + d.est)
}