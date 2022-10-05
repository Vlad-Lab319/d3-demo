// Data fetching
const regions = d3.csv(
  // ",",
  "js/data/housing.csv"

)

const usa = d3.csv(
  // ",",
  "js/data/census-regions.csv"

)

const test1 = d3.csv(
  // ",",
  "js/data/test1.csv"

)

// const population = d3.tsv(
// "js/data/population.tsv"

// )

// console.log('CSV: ', regions, usa, population);
console.log('CSV: ', test1);


// Chart

const population = d3.tsv(
  "js/data/population.tsv"

).then(data => {


  let width = 100,
    height = 100

  // let data = population

  const treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .padding(d => d.height === 1 ? 1 : 0)
    .round(true);

  const root = treemap(d3.hierarchy(data)
    .sum(d => Array.isArray(d.values) ? d3.sum(d.values) : 0)
    // .sort((a, b) => b.value - a.value)
  );

  // console.log('Treemap: ', treemap, data, root);

})


// Basic treemap example

// set the dimensions and margins of the graph
const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  wdt = 645 - margin.left - margin.right,
  ht = 645 - margin.top - margin.bottom;

// append the svg object to the body of the page
d3.select('body')
  .append('div')
  .attr('id', 'my_dataviz')

const svg2 = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", wdt + margin.left + margin.right)
  .attr("height", ht + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    `translate(${margin.left}, ${margin.top})`);

d3.csv('js/data/test2.csv').then(function (data) {

  let housingColor;
  let tooltip2 = d3.select('.container')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);

  // stratify the data: reformatting for d3.js
  const root = d3.stratify()
    .id(function (d) { return d.name; })   // Name of the entity (column name is name in csv)
    .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (data);
  root.sum(function (d) { return +d.value })   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([wdt, ht])
    .padding(4)
    (root)

  console.log('root: ', root);

  // use this information to add rectangles:
  svg2
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", "#69b3a2")

    .on('mouseover', function (event, d) {
      // console.log('event: ', event.x, event.y, 'd: ', d)
      tooltip2.transition().duration(200)
        .style('opacity', .9)
      tooltip2.html(
        '<div style="font-size: 2rem; font-weight: bold">' +
        d.data.value + '</div>'
      )
        .style('left', (event.pageX - 35) + 'px')
        .style('top', (event.pageY - 30) + 'px')
      housingColor = this.style.fill;
      d3.select(this)
        // .style('fill', 'yellow')
    })
  
    .on('mouseout', function (event, d) {
      // console.log('event: ', event, 'd: ', d)
  
      tooltip2.html('')
      d3.select(this)
        .style('fill', housingColor)
    });

  // and to add the text labels
  svg2
    .selectAll("text")
    .data(root.leaves())
    .join("text")
    .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
    .text(function (d) { return d.data.name })
    .attr("font-size", "15px")
    .attr("fill", "white")


})