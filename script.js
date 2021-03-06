// Data Visualization Script

// Set the margin and padding of the SVG
//var margin = { top: 50, right: 20, bottom: 50, left: 100 }
const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const padding = 50

// Set the width and height using the current width and height of the div
const width = 960
const height = 400

// Create svg and append to chart div
var svg = d3.select('#chart')
  .append('svg')
  .attr('class', 'graph')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)


// Get the data
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
const chart = async () => {
  let getData = await fetch(url)
  let rawData = await getData.json()
  let dataset = rawData.monthlyVariance.map(d => {
    let newDate = new Date()
    newDate.setFullYear(d.year, (d.month - 1), 01)
    let monthName = newDate.toLocaleString("en-us", { month: "long" })
    return {
      year: d.year,
      month: d.month,
      variance: d.variance,
      date: newDate,
      monthName: monthName
    }
  })

  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  // const colors = ["#ef5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#26C6DA", "#26A69A", "#D4E157", "#FFEE58", "#FFA726"]
  
  const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
  
  // Declare min max variables
  const minYear = d3.min(dataset.map(d => d.year))
  const maxYear = d3.max(dataset.map(d => d.year))

  const barWidth = width / (dataset.length/12)
  const barHeight = height / 12

  // Define scale
  const yScale = d3.scaleBand()
    .domain(month)
    .range([padding, (height-padding)])

  const xScale = d3.scaleTime()
    .domain([new Date(minYear, 0), new Date(maxYear, 0)])
    .range([padding, width-padding])

  const colorScale = d3.scaleQuantile()
    .domain(d3.extent(dataset, (d) => d.variance)) 
    .range(colors)

  // Add labels 
  // Title
  svg.append('text')
    .text('Monthly Global Land-Surface Temperature')
    .attr('id', 'title')
    .attr(`transform`, `translate(${width / 2}, ${padding / 3})`)

  // Description
  svg.append('text')
    .text(`${minYear}-${maxYear}: base temperature ${rawData.baseTemperature}`)
    .attr('id', 'description')
    .attr(`transform`, `translate(${width / 2}, ${padding / 1.25})`)
    
  // Tooltip  
  const tooltip = d3.select('#chart').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  // Add axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"))
    
  const yAxis = d3.axisLeft(yScale)

  svg.append('g')
    .call(xAxis.ticks(20))
    .attr('id', 'x-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - padding})`)

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)

  // Axes Labels
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -250)
    .attr('y', -10)
    .attr('class', 'labels')
    .text('Months')

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 20)
    .attr('class', 'labels')
    .text('Years')

  // Legend
  // Inspired by Seinfeld70 - https://codepen.io/Seinfeld/full/LBKQox/
  const legend = svg.append('g')
    .attr('id', 'legend')

  // Add the color map
  legend.selectAll("rect")
    .data(colors)
    .enter()
    .append('rect')
    .attr("width", (width - padding) / colors.length)
    .attr("height", 20)
    .attr('x', (d, i) => (i * ((width - padding) / colors.length))+(padding/2))
    .attr('y', height + 20)
    .style("fill", (d) => d)

  let legendScale = d3.scaleLinear().domain([2.8, 12.8]).range([0, width - padding]);
  legend.append('g')
    .attr('transform', `translate(${padding/2}, ${height + 45})`)
    .call(d3.axisBottom(legendScale))

  legend.append('text')
    .attr('x', (width - padding) / 2)
    .attr('y', height + 10)
    .attr('id', 'legend-title')
    .text('Temperature Gauge')

  // Add heatmap
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect') 
    .attr('class', 'cell')
    .attr('data-month', (d) => d.date.getMonth())
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance)
    .attr('x', (d) => xScale(d.date))
    .attr('y', (d) => yScale(d.monthName))
    .attr('width', barWidth)
    .attr('height', barHeight)
    .attr('fill', (d) => colorScale(d.variance))
    .on('mouseover', (d) => {
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip.html(
        `<p>${d.year} - ${d.monthName}<br>
        ${(d.variance + rawData.baseTemperature).toFixed(2) }&#8451<br>
        ${d.variance.toFixed(2)}&#8451</p>`)
        .attr('data-year', d.year)
        .style('left', `${d3.event.layerX}px`)
        .style('top', `${d3.event.layerY - 28}px`)
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 
}

chart()