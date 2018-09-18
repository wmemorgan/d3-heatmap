// Data Visualization Script

// Set the margin and padding of the SVG
var margin = { top: 50, right: 20, bottom: 50, left: 100 }
var padding = 50

// Set the width and height using the current width and height of the div
var width = 800
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

  // Declare min max variables
  console.log(`dataset: `, dataset)
  const minYear = d3.min(dataset.map(d => d.year))
  const maxYear = d3.max(dataset.map(d => d.year))

  const minMonth = d3.min(dataset.map(d => d.date.getMonth()))
  console.log(`minMonth`, minMonth)
  const maxMonth = d3.max(dataset.map(d => d.date.getMonth()))
  console.log(`maxMonth`, maxMonth)

  // Define scale
  const yScale = d3.scaleBand()
    .domain(month)
    .range([padding, (height-padding)])

  const xScale = d3.scaleTime()
    .domain([new Date(minYear, 0), new Date(maxYear, 0)])
    .range([padding, width - padding])

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
    .attr('y', height)
    .attr('class', 'labels')
    .text('Years')
}

chart()