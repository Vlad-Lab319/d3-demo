d3.json('js/data/forecast.json')
  .then((data) => {
    const temperatures = [],
      dates = [],
      margin = { top: 0, right: 0, bottom: 30, left: 20 }
    height = 500 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;

    let tempColor,
      yScale,
      yAxisValues,
      yAxisTicks,
      yGuide,
      xScale,
      xAxisValues,
      xAxisTicks,
      xGuide,
      colors,
      tooltip,
      myChart;

    // console.log('data: ', data);

    for (let i = 0; i < data.list.length; i++) {
      temperatures.push(data.list[i].main.temp);
      dates.push(new Date(data.list[i].dt_txt));
    }

    yScale = d3.scaleLinear()
      .domain([0, d3.max(temperatures)])
      .range([0, height]);

    yAxisValues = d3.scaleLinear()
      .domain([0, d3.max(temperatures)])
      .range([height, 0]);

    yAxisTicks = d3.axisLeft(yAxisValues)
      .ticks(10)

    xScale = d3.scaleBand()
      .domain(temperatures)
      .paddingInner(.1)
      .paddingOuter(.1)
      .range([0, width])

    xAxisValues = d3.scaleTime()
      .domain([dates[0], dates[(dates.length - 1)]])
      .range([0, width])

    xAxisTicks = d3.axisBottom(xAxisValues)
      .ticks(d3.timeDay.every(1))

    colors = d3.scaleLinear()
      .domain([0, 65, d3.max(temperatures)])
      .range(['#FFFFFF', '#2D8BCF', '#DA3637'])

    tooltip = d3.select('.container')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '0 10px')
      .style('background', 'white')
      .style('opacity', 0)
      .style('pointer-events', 'none')


    myChart = d3.select('#viz')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.right + ')')
      .selectAll('rect').data(temperatures)
      .enter().append('rect')
      .attr('fill', colors)
      .attr('width', function (d) {
        return xScale.bandwidth();
      })
      .attr('height', 0)
      .attr('x', function (d) {
        return xScale(d);
      })
      .attr('y', height)

      .on('mouseover', function (event, d) {
        // console.log('event: ', event.x, event.y, 'd: ', d)
        tooltip.transition().duration(200)
          .style('opacity', .9)
        tooltip.html(
          '<div style="font-size: 2rem; font-weight: bold">' +
          d + '&deg;</div>'
        )
          .style('left', (event.pageX - 35) + 'px')
          .style('top', (event.pageY - 30) + 'px')
        tempColor = this.style.fill;
        d3.select(this)
          .style('fill', 'yellow')
      })

      .on('mouseout', function (event, d) {
        // console.log('event: ', event, 'd: ', d)

        tooltip.html('')
        d3.select(this)
          .style('fill', tempColor)
      });

    yGuide = d3.select('#viz svg').append('g')
      .attr('transform', 'translate(20,0)')
      .call(yAxisTicks)

    xGuide = d3.select('#viz svg').append('g')
      .attr('transform', 'translate(20,' + height + ')')
      .call(xAxisTicks)

    myChart.transition()
      .attr('height', function (d) {
        return yScale(d);
      })
      .attr('y', function (d) {
        return height - yScale(d);
      })
      .delay(function (d, i) {
        return i * 20;
      })
      .duration(1000)
      .ease(d3.easeBounceOut)

    return {
      forecast: 'forecast',
      temperatures: temperatures,
      dates: dates
    };
  })

// Pie

const matrix = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907]
];

const svg = d3.select('body')
  .append('svg')
  .attr('class', 'pie')
  .attr('width', '500')
  .attr('height', '400')
w = svg.attr("width"),
  h = svg.attr("height"),
  radius = Math.min(w, h) / 2;

// console.log('Pie: ', w, h, radius);

const g = svg.append('g')
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

const color = d3.scaleOrdinal([
  '#4daf4a',
  '#377eb8',
  '#ff7f00',
  '#984ea3',
  // '#e41a1c'
]);

const pie = d3.pie()
  .value(d => d)
  (matrix[3])



// console.log('Pie: ', pie);

const path = d3.arc()
  .outerRadius(radius)
  .innerRadius(0)

const label = d3.arc()
  .outerRadius(radius)
  .innerRadius(radius - 80)

const arc = g.selectAll('.arc')
  .data(pie)
  .enter().append('g')
  .attr('class', 'arc')

arc.append('path')
  .attr('d', path)
  .attr('fill',
    function (d) {
      // console.log('color: ', d)
      return color(d.index)
    }
    // 'red'
  )

// console.log("arc: ", arc);

// Table

// d3.select("body")
//   .append("table")
//   .style('margin', 'auto')
//   .selectAll("tr")
//   .data(matrix)
//   .join("tr")
//   .selectAll("td")
//   .data(d => d)
//   .join("td")
//   .text(d => d);



// Bars and line

// const graph = d3.select('body')
//   .append('svg')
//   .attr("width", 500)
//   .attr("height", 500)

// const line = graph.append('line')
//   .attr('x1', 100)
//   .attr('x2', 500)
//   .attr('y1', 50)
//   .attr('y2', 250)
//   .attr('stroke', 'red')

// const bar1 = graph.append('g')
//   .attr("fill", "blue")

// const leftBar = bar1.append("rect")
//   .attr("x", 120)
//   .attr("y", 20)
//   .attr("height", 20)
//   .attr("width", 10)

// const bar2 = graph.append("rect")
//   .attr("fill", "blue")
//   .attr("x", 360)
//   .attr("y", 20)
//   .attr("height", 20)
//   .attr("width", 10)


// update();

// function update() {
//   line.transition()
//     .duration(1000)
//     .attr("x2", 400)
//     .ease(d3.easeBounceOut)

//   leftBar.transition()
//     .ease(d3.easeBounceOut)

//     .duration(2000)
//     .attr("height", 240)

//   bar2.transition()
//     .ease(d3.easeLinear)
//     .duration(2000)
//     .delay(2000)
//     .attr("height", 240)
// }
