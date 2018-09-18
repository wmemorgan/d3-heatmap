// Data Visualization Script

// Set the margin and padding of the SVG
var margin = { top: 50, right: 20, bottom: 50, left: 100 }
var padding = 50

// Set the width and height using the current width and height of the div
var width = 800
var height = 400

// Get the data
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
const chart = async () => {
  let getData = await fetch(url)
  let rawData = await getData.json()
  console.log(`rawData: `, rawData)
  console.log(`rawData.baseTemperature: `, rawData.baseTemperature)
  console.log(`rawData.monthlyVariance: `, rawData.monthlyVariance)
}

chart()