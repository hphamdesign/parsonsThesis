const overallWidth = document.querySelector('#chart').clientWidth
const overallHeight = document.querySelector('#chart').clientHeight

let columns = 12

const config = {
    numColumns: columns,
    overallWidth: columns * 60,
}

const label = d3.select("#chart_head").append('svg').attr('width', 800).attr('height', 30)
const svg = d3.select("#chart").append('svg').attr('width', overallWidth).attr('height', overallHeight)

const head_date = ["10/23/22", "10/30/22", "11/06/22", "11/13/22", "11/20/22", "11/27/22", "12/04/22", "12/11/22", "12/18/22", "12/25/22", "01/01/23", "01/08/23"]
const dx_list = [10, 70, 130, 190, 250, 310, 370, 430, 490, 550, 610, 670]

//add x axis
label
    .selectAll("text")
    .data(head_date)
    .join("text")
    .attr("x", (d, i) => +dx_list[i] + 32)
    .attr("y", 25)
    .text(d => d)

let data
let layoutData

// Create a tooltip element
const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");

const datasets = {
    ranking: "https://raw.githubusercontent.com/hphamdesign/parsonsThesis/main/data/rankingData.json",
    meta: "https://raw.githubusercontent.com/hphamdesign/parsonsThesis/main/data/bookMetadataRevised.json"
}

const promises = [
    d3.json(datasets.ranking),
    d3.json(datasets.meta)
]

Promise.all(promises).then(data => {
    // console.log(data[0])

    rankData = data[0].filter(d => d.source === 'nyt').filter(d => d.genre === 'fiction').sort((a, b) => a.ranking - b.ranking);
    layout(rankData)

    console.log(rankData)

    console.log(layoutData)
    console.log(data[1])

    let rectData = []


    for (let i = 0; i < layoutData.length; i++) {
        for (let j = 0; j < data[1].length; j++) {
            if (layoutData[i]["tittle"] === data[1][j]['tittle']) {
                rectData.push({
                    tittle: data[1][j]['tittle'],
                    author: data[1][j]['author'],
                    width: layoutData[i]['width'],
                    height: layoutData[i]['height'],
                    x: layoutData[i]["x"],
                    y: layoutData[i]['y'],
                    link: data[1][j]['cove_src'],
                    match: data[0][j]['match']
                })
            }
        }
    }

    console.log(rectData)

    // Store the reference to the SVG container for the covers
    const coverContainer = svg.append('g');

    // Create the covers as SVG images and add a class for similar titles
    const covers = coverContainer.selectAll("rects")
        .data(rectData)
        .enter()
        .append("image")
        .attr('xlink:href', d => d.link)
        .attr('class', "covers")
        .attr('id', d => d.author)
        .attr('data-title', d => d.tittle)
        .attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr("opacity", "1")
        .attr("filter", "grayscale(100%)")
        //put if function
        .attr("transform", "translate(50,0)")
    // e => console.log(e.target.getAttribute('data-title'))

    // Attach event handlers for hover effect
    covers
        .on("mouseenter", e => {
            // d3.selectAll('orangeCovers').data(rectData)
            d3.selectAll('.covers')
                .transition()
                .duration(100)
                .attr("filter", (d) => {
                    if (d.tittle === e.target.getAttribute('data-title') && d.match === "Yes") {
                        return "grayscale(0%)"
                    } else {
                        return "grayscale(100%)"
                    }
                })
                .attr('opacity', d => d.tittle === e.target.getAttribute('data-title') ? "100%" : "20%")

            d3.select("#mainViz2-tooltip h1")
                .html(e.target.getAttribute('data-title'))
            d3.select("#mainViz2-tooltip p")
                .html(e.target.getAttribute('id'))
        })
        .on("mouseleave", () => {
            d3.selectAll('.covers').attr("filter", "grayscale(100%)").attr('opacity', '100%')
            d3.select("#mainViz2-tooltip h1")
                .html('')
            d3.select("#mainViz2-tooltip p")
                .html('')
        });
    //Toggle button to show books that appeared on Amazon
    var buttonAmazon = document.getElementById("switch");
    buttonAmazon.addEventListener("click", function (event) {
        const isAmazonOn = event.target.checked;
        covers.transition().duration(500).attr("filter", (d) => {
            if (isAmazonOn && d.match === "Yes") {
                return "grayscale(0%)";
            } else {
                return "grayscale(100%)";
            }
        })
            .attr("opacity", (d) => {
                if (isAmazonOn && d.match === "Yes") {
                    return "100%";
                } else {
                    return "20%";
                }
            });
    });


})

function layout(data) {
    const cellWidth = config.overallWidth / config.numColumns
    const cellHeight = 45

    let bookWidth = 32
    let bookHeight = 43
    //let cellHeight = 5

    layoutData = data.map(function (d, i) {
        let item = {}

        let column = i % config.numColumns
        let row = Math.floor(i / config.numColumns)

        item.x = cellWidth * column
        item.y = cellHeight * row

        item.width = bookWidth
        item.height = bookHeight

        item.sensorWidth = bookWidth
        item.sensorHeight = cellHeight

        item["book_index"] = d.tittle
        item["week"] = d.week
        item.tittle = d.tittle
        item.week = d.week

        return item
    })
}


function update(data) {
    const layoutData = layout(data)
}