class PriceChart {
    constructor(opts) {
        this.element = opts.element;
        this.dataset = opts.dataset;
        this.mediator = opts.mediator;
        this.accesors = opts.accesors
        this.inputDimensions = opts.dimensions
        this.nbars = opts.nbars

        this.startYear = opts.startYear
        this.endYear = opts.endYear



    }

    async draw(symbol) {

        var table = d3.select(this.element);

        this.dateParser = d3.timeParse("%s")
        this.xAccessor = d => this.dateParser(d.unixtime);
        this.yAccessor = this.accesors.filter(d => d.name == 'close')[0]['accessor'];
        this.dimensions = {
            width: this.inputDimensions.width,
            height: this.inputDimensions.height,
            margin: {
                top: 50, //15
                right: 39, //15 additional year space
                bottom: 15, //40 
                left: 15, //60
            },
        }
        this.dimensions.boundedWidth = this.dimensions.width
            - this.dimensions.margin.left
            - this.dimensions.margin.right
        this.dimensions.boundedHeight = this.dimensions.height
            - this.dimensions.margin.top
            - this.dimensions.margin.bottom

        this.wrapper = d3.select(this.element)
        this.wrapper.selectAll("*").remove();
        this.wrapper = this.wrapper
            .append("svg")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.height)

        this.bounds = this.wrapper.append("g")
            .style("transform", `translate(${
                this.dimensions.margin.left
                }px, ${
                this.dimensions.margin.top
                }px)`)

        this.bounds.append("path")
            .attr("class", "line")

        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.dataset, this.yAccessor))
            .range([this.dimensions.boundedHeight, 0])
            .nice()
        console.log(this.dataset)
        console.log(this.yScale.domain())
        console.log(this.yScale.range())


        this.xScale = d3.scaleTime()
            //.domain(d3.extent(this.dataset, xAccessor))
            // .domain(d3.extent(this.dataset, this.xAccessor))
            .domain([this.startYear, this.endYear])
            .range([0, this.dimensions.boundedWidth])



        const lineGenerator = d3.line()
            .x(d => this.xScale(this.xAccessor(d)))
            .y(d => this.yScale(this.yAccessor(d)))


        const line = this.bounds.select(".line")
            .attr("d", lineGenerator(this.dataset))


        // 6. Draw peripherals

        const yAxisGenerator = d3.axisLeft()
            .scale(this.yScale)

        const yAxis = this.bounds.select(".y-axis")
            .call(yAxisGenerator)

        const xAxisGenerator = d3.axisTop()
            .scale(this.xScale)
            .tickFormat(function (d){
                return "'" + d3.format('02d')(d.getFullYear()%1000)
            })

        // const xAxis = this.bounds.select(".x-axis")
        //     .call(xAxisGenerator)
        const xAxis = this.bounds.append("g")
            .call(xAxisGenerator)
            .style("transform", `translateY(${
            -this.dimensions.margin.top + 30
            }px)`)

        const xGridlinesGenerator = d3.axisBottom(this.xScale)
            //.ticks()

        const yGridlinesGenerator = d3.axisLeft(this.yScale)
            .tickSizeInner(3) // the inner ticks will be of size 3
            .tickSizeOuter(0) // the outer ones of 0 size
            .ticks(5)
            

        // add the X gridlines
        const xGrid = this.bounds.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + this.dimensions.boundedHeight + ")")
            .call(xGridlinesGenerator
                .tickSize(-this.dimensions.boundedHeight)
                .tickFormat("")
            )

        const yGrid = this.bounds.append("g")			
            .attr("class", "grid")
            .call(yGridlinesGenerator
                .tickSizeOuter(0) 
                .tickSize(-this.dimensions.boundedWidth)
                .tickFormat("")
            )



        this.highlightBox = this.bounds.append("rect")
            .attr("id", "highlight-box")
            .attr("fill", "DarkGreen")
            .attr("opacity", 0.3)
        const yearParser = d3.timeParse("%Y")
        // this.highlightTime(yearParser(2016), yearParser(2017))

        var that = this
        this.listeningRect = this.bounds.append("rect")
            .attr("class", "listening-rect")
            .attr("width", this.dimensions.boundedWidth)
            .attr("height", this.dimensions.boundedHeight)
            .on("mousemove", function () {
                const mousePosition = d3.mouse(this)
                const hoveredDate = that.xScale.invert(mousePosition[0])
                var selectedYear = hoveredDate.getFullYear()
                var endYear = selectedYear + 1
                const dateParser = d3.timeParse("%Y")
                that.mediator.highlightTime(dateParser(selectedYear), dateParser(endYear))
            })
            .on('mouseout', function() {
                that.mediator.unHighlightTime()
            })



    }

    highlightTime(start, end) {
        const startY = this.yScale.range()[1]

        this.highlightBox
            .attr("visibility", 'visible')
            .attr("x", this.xScale(start))
            .attr("y", this.yScale.range()[0] - (this.yScale.range()[0] - startY))
            .attr("width", this.xScale(end) - this.xScale(start))
            .attr("height", this.yScale.range()[0] - startY)

    }

    unHighlightTime(start, end) {
        this.highlightBox
            .attr("visibility", 'hidden')
    }
}
