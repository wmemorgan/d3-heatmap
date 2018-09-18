// Data Visualization Script

// Set the margin and padding of the SVG
var margin = { top: 50, right: 20, bottom: 50, left: 100 }
var padding = 60

// Set the width and height using the current width and height of the div
var width = 960
var height = 400

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
  console.log(`rawData: `, rawData)
  // let dataset = rawData.monthlyVariance
  // console.log(`dataset: `, dataset)
  console.log(`rawData.baseTemperature: `, rawData.baseTemperature)
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
  
  var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
  
  // Declare min max variables
  console.log(`dataset: `, dataset)
  const minYear = d3.min(dataset.map(d => d.year))
  const maxYear = d3.max(dataset.map(d => d.year))

  const minMonth = d3.min(dataset.map(d => d.date.getMonth()))
  console.log(`minMonth`, minMonth)
  const maxMonth = d3.max(dataset.map(d => d.date.getMonth()))
  console.log(`maxMonth`, maxMonth)

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
    .attr("x", width / 2)
    .attr("y", padding / 2) 

  // Description
  svg.append('text')
    .text(`${minYear}-${maxYear}: base temperature ${rawData.baseTemperature}`)
    .attr('id', 'description')
    .attr("x", width / 2)
    .attr("y", padding / 1)
    
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
    .attr('x', (d, i) => i * ((width - padding) / colors.length))
    .attr('y', height + 20)
    .style("fill", (d) => d)

  let legendScale = d3.scaleLinear().domain([2.8, 12.8]).range([0, width - padding]);
  legend.append('g')
    .attr('transform', `translate(0, ${height + 45})`)
    .call(d3.axisBottom(legendScale))

  legend.append('text')
    .attr('x', (width - padding) / 2)
    .attr('y', height + 10)
    .attr('id', 'legend-title')
    .text('Temperature Gauge')

  // //Append a defs (for definition) element to your SVG
  // var defs = svg.append("defs");

  // //Append a linearGradient element to the defs and give it a unique id
  // var linearGradient = defs.append("linearGradient")
  //   .attr("id", "linear-gradient");

  // //Horizontal gradient
  // linearGradient
  //   .attr("x1", "0%")
  //   .attr("y1", "0%")
  //   .attr("x2", "100%")
  //   .attr("y2", "0%")

  // //Append multiple color stops by using D3's data/enter step
  // linearGradient.selectAll("stop")
  //   .data(colors)
  //   .enter().append("stop")
  //   .attr("offset", (d, i) => i / (colors.length - 1))
  //   .attr("stop-color", (d) => d)
 
  // //Manually assign multiple colors  
  // linearGradient.selectAll("stop")
  //   .data([
  //   { offset: "0%", color: colors[0] },
  //   { offset: "12.5%", color: colors[1] },
  //   { offset: "25%", color: colors[2] },
  //   { offset: "37.5%", color: colors[3] },
  //   { offset: "50%", color: colors[4] },
  //   { offset: "62.5%", color: colors[5] },
  //   { offset: "75%", color: colors[6] },
  //   { offset: "87.5%", color: colors[7] },
  //   { offset: "100%", color: colors[8] }
  //     ]
  //   )
  //   .enter().append("stop")
  //   .attr("offset", (d, i) => d.offset)
  //   .attr("stop-color", (d) => d.color)

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