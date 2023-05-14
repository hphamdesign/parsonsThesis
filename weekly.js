const weekly = document.querySelector(".weekly")
const width = weekly.clientWidth
const height = weekly.clientHeight

let nytPositions = []
let amazonPositions = []

let week = '2022-10-23'
let source = 'nyt'
let genre = 'fiction'

Promise.all([
    d3.json("https://raw.githubusercontent.com/hphamdesign/parsonsThesis/main/data/rankingData.json"),
    d3.json("https://raw.githubusercontent.com/hphamdesign/parsonsThesis/main/data/bookMetadata.json")
]).then(function ([data, data1]) {

    console.log(data1)

    function getUniqueWeeks(d) {
        const weeks = d.map(data => data.week);
        return [...new Set(weeks)];
    }

    const uniqueWeeks = getUniqueWeeks(data);
    console.log(uniqueWeeks);

    var dropdownButton = d3.select(".weekly")
        .append('select')
        .attr('class', 'dropdown')

    // add the options to the button
    dropdownButton // Add a button
        .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
        .data(uniqueWeeks)
        .enter()
        .append('option')
        .text(function (d) { return 'Week of ' + d; }) // text showed in the menu
    // .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // Create a div for mouseover effect
    var div = d3.select("body").append("div")
        .attr("class", "weeklyTooltip")
        .style("opacity", 0);

    let y = d3.scaleLinear().domain([1, 15]).range([70, height - 100])
    // let filteredData

    // let week = 1
    // let source = 'nyt'
    // let genre = 'fiction'


    // let nytData = data.filter(d => d.source === 'nyt').filter(d => d['week'] === '2022-10-23').filter(d => d.genre === 'fiction')
    // let amazonData = data.filter(d => d.source === 'amazon').filter(d => d['week'] === '2022-10-23').filter(d => d.genre === 'fiction')

    // console.log(nytData)

    const filterDataHandler = (source, week, genre) => {
        filteredData = data.filter(d => d.source === source).filter(d => d['week'] === week).filter(d => d.genre === genre)
    }

    // console.log(nytData)
    // console.log(amazonData)

    // filterDataHandler(source, week, genre)

    svg2 = d3.select('.weekly').append('svg').attr('width', width).attr('height', height)

    function chartGenerator() {

        //calculate nytData and amazonData
        let nytData = data.filter(d => d.source === 'nyt').filter(d => d['week'] === week).filter(d => d.genre === genre)
        let amazonData = data.filter(d => d.source === 'amazon').filter(d => d['week'] === week).filter(d => d.genre === genre)


        let nytDots = svg2.selectAll('nyt')
            .data(nytData)
            .enter()
            .append('circle')
            .attr('class', "nytCircle")
            .attr('cx', width / 2 - 200)
            .attr('cy', d => y(+d.ranking))
            .attr('r', 8.5)
            .attr('fill', function (d) {
                if (d.match === "Yes") {
                    return "#CACACA"
                }
                else {
                    return "#3AA0D4"
                }
            })
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration('50')
                //Makes the new div appear on hover:
                div.transition()
                    .duration('50')
                    .style("opacity", '0.75');
                div.html("<div class=rank>" + d.ranking + "</div>" + "<br>" + "<div class=bookTitle>" + d["tittle"].toUpperCase() + "</div>" + "<br>" + "<div class=author>" + d.author + "</div>")
                    .style("left", (event.pageX - 270) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                //Makes the new div disappear:
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
            })
        positionGenerator(nytData, nytPositions, "nyt")

        console.log(nytPositions)

        let amazonDots = svg2.selectAll('amazon')
            .data(amazonData)
            .enter()
            .append('circle')
            .attr('class', "amazonCircle")
            .attr('cx', width / 2 + 200)
            .attr('cy', d => y(+d.ranking))
            .attr('r', 8.5)
            .attr('fill', function (d) {
                if (d.match === "Yes") {
                    return "#CACACA"
                }
                else {
                    return "#E8661E"
                }
            })
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                    .duration('50')
                //Makes the new div appear on hover:
                div.transition()
                    .duration('50')
                    .style("opacity", '0.75');
                div.html("<div class=rank>" + d.ranking + "</div>" + "<br>" + "<div class=bookTitle>" + d["tittle"].toUpperCase() + "</div>" + "<br>" + "<div class=author>" + d.author + "</div>")
                    .style("left", (event.pageX + 40) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                //Makes the new div disappear:
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
            });

        positionGenerator(amazonData, amazonPositions, "amazon")


        let overlappedPosition = []

        for (let i = 0; i < nytData.length; i++) {
            for (let j = 0; j < amazonData.length; j++) {
                if (nytData[i]['tittle'] === amazonData[j]['tittle']) {
                    overlappedPosition.push([nytPositions[i], amazonPositions[j]])
                }
            }
        }

        console.log(overlappedPosition)
        // // console.log(amazonPositions)
        svg2.selectAll(".line").remove()

        let lines = svg2.selectAll('lines').data(overlappedPosition)
            .enter()
            .append('line')
            .attr('class', "line")
            .attr('x1', d => d[0][0])
            .attr('x2', d => d[0][0])
            .attr('y1', d => d[0][1])
            .attr('y2', d => d[0][1])
            .style('stroke-width', '1.5px')
            .style('stroke-dasharray', function (d) {
                if (d[0][1] === d[1][1]) {
                    return '5,0';
                } else {
                    return '5,7';
                }
            })
            .style('stroke', '#CACACA')
            .style('background-color', 'black')
            .transition() // add transition
            .duration(900) // set transition duration in milliseconds
            .attr('x2', d => d[1][0])
            .attr('y2', d => d[1][1]);
    }

    chartGenerator()


    // When the button is changed, run the updateChart function
    d3.select(".dropdown").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        selectedOption = selectedOption.slice(8, selectedOption.length)
        week = selectedOption

        // nytData = data.filter(d => d.source === 'nyt').filter(d => d['week'] === selectedOption).filter(d => d.genre === 'fiction')
        // amazonData = data.filter(d => d.source === 'amazon').filter(d => d['week'] === selectedOption).filter(d => d.genre === 'fiction')
        chartGenerator()
    })

    // Event-listener for fiction/nonfiction toggle
    document.getElementById('radio-one').addEventListener('click', function () {
        // filter the data based on the selected genre
        genre = 'fiction'
        // nytFiction = data.filter(d => d.source === 'nyt').filter(d => d.genre === 'fiction')
        // amazonFiction = data.filter(d => d.source === 'amazon').filter(d => d.genre === 'fiction')
        // console.log(nytFiction, amazonFiction);
        chartGenerator()
    });

    document.getElementById('radio-two').addEventListener('click', function (d) {
        // filter the data based on the selected genre
        genre = 'nonfiction'
        // nytNonfiction = data.filter(d => d.source === 'nyt').filter(d => d.genre === 'nonfiction')
        // amazonNonfiction = data.filter(d => d.source === 'amazon').filter(d => d.genre === 'nonfiction')
        // console.log(nytNonfiction, amazonNonfiction);
        chartGenerator()
    });


    function positionGenerator(data, list, company) {
        for (let i = 0; i < data.length; i++) {
            list[i] = [
                +document.querySelectorAll(`.${company}Circle`)[i].attributes.cx.value,
                +document.querySelectorAll(`.${company}Circle`)[i].attributes.cy.value
            ]
        }
    }
})

//Create legend for graph
const svg3 = d3.select("#weeklyLegend")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const legendData = [
    { type: "circle", color: "#3AA0D4", text: "Books unique to NYT" },
    { type: "circle", color: "#E8661E", text: "Books unique to Amazon" },
    { type: "circle", color: "#B3B3B3", text: "Books on both list" },
    { type: "line", color: "#B3B3B3", text: "Same ranking", dash: false },
    { type: "line", color: "#B3B3B3", text: "Different rankings", dash: true }
];

const legend = svg3.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width / 2 - (legendData.length * 180) / 2) + "," + (height - 50) + ")");

const legendItems = legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => "translate(" + (i * 180) + ", 0)");

legendItems.each(function (d) {
    const currentItem = d3.select(this);
    if (d.type === "circle") {
        currentItem.append("circle")
            .attr("cx", 25)
            .attr("cy", 0)
            .attr("r", 7)
            .style("fill", d.color);
    } else if (d.type === "line") {
        currentItem.append("line")
            .attr("x1", -15)
            .attr("y1", 0)
            .attr("x2", 30)
            .attr("y2", 0)
            .style("stroke", d.color)
            .style("stroke-width", "1.5px")
            .style("stroke-dasharray", d.dash ? "3,3" : "none");
    }

    currentItem.append("text")
        .attr("x", 40)
        .attr("y", 5)
        .text(d.text);
});

