class LinePointChart {
    constructor(opts) {
        this.element = opts.element;
        this.dataset = opts.dataset;
        this.mediator = opts.mediator;
        this.accesors = opts.accesors
        this.inputDimensions = opts.dimensions
        this.nbars = opts.nbars
        this.colors = opts.colors

        // add for visualization
        this.dataset.unshift(Object.assign({}, this.dataset[0]))
        this.dataset[0]['year'] = this.dataset[0]['year'] + 1

    }

    async draw(symbol) {

        this.dateParser = d3.timeParse("%Y")
        this.xAccessor = d => this.dateParser(d.year);

        this.dimensions = {
            width: this.inputDimensions.width,
            height: this.inputDimensions.height,
            margin: {
                top: 50, //15
                right: 15, //15
                bottom: 0, //40 
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

        var dataMaps = []
        for(var i=0; i<this.accesors.length; i++) {
            dataMaps.push(...this.dataset.map(this.accesors[i]['accessor']))
        }
        dataMaps.push(0)
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(dataMaps)
            )
            .range([this.dimensions.boundedHeight, 0])
            .nice()



        this.xScale = d3.scaleTime()
            //.domain(d3.extent(this.dataset, xAccessor))
            .domain(d3.extent(this.dataset, this.xAccessor))
            .range([0, this.dimensions.boundedWidth])

        this.lineGenerators = []
        this.lines = []
        this.dots = []
        for (var i = 0; i < this.accesors.length; i++) {
            this.lineGenerators[i] = d3.line()
                .x(d => this.xScale(this.xAccessor(d)))
                .y(d => this.yScale(this.accesors[i]['accessor'](d)))

            this.lines[i] = this.bounds.append('path')
                .attr("class", 'line')
                .attr("d", this.lineGenerators[i](this.dataset))
                .style("stroke", this.colors[i])

            // this.dots[i] = this.bounds.selectAll(".dots")
            //     .data(this.dataset)
            //     .enter().append("circle")
            //     .attr("class", 'dot')
            //     .attr("r", 2)
            //     .attr("cx", d => this.xScale(this.xAccessor(d)))
            //     .attr("cy", d => this.yScale(this.accesors[i]['accessor'](d)))
            //     .style("stroke", this.colors[i])
        }


        // 6. Draw peripherals

        const yAxisGenerator = d3.axisLeft()
            .scale(this.yScale)

        // const yAxis = this.bounds.append("g")
        //     .call(yAxisGenerator)
        //     .style("transform", `translateX(${
        //         this.dimensions.margin.left + 20
        //         }px)`)
        
        const zeroline = this.bounds
        .append("line")
        .attr('class', 'zeroline')
        .attr("x1", this.xScale.range()[0])
        .attr("y1", this.yScale(0))
        .attr("x2", this.xScale.range()[1])
        .attr("y2", this.yScale(0))
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))

        const xAxisGenerator = d3.axisTop()
            .scale(this.xScale)
            .tickFormat(function (d){
                return d3.format('02d')(d.getFullYear()%1000)
            })

        const xAxis = this.bounds.append("g")
            .call(xAxisGenerator)
            .style("transform", `translateY(${
                -this.dimensions.margin.top + 30
                }px)`)



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
        // const startY = this.yScale.range()[1]
        // this.highlightBox
        //     .attr('visibility', 'visible')
        //     .attr("x", this.xScale(start))
        //     .attr("y", this.yScale.range()[0] - (this.yScale.range()[0] - startY))
        //     .attr("width", this.xScale(end) - this.xScale(start))
        //     .attr("height", this.yScale.range()[0] - startY)

    }

    unHighlightTime(start, end) {
        this.highlightBox
            .attr("visibility", 'hidden')
    }

    bold(name) {
        var selected_index = this.accesors.findIndex(x => x.name === name);
        for (var i = 0; i < this.lines.length; i++) {
            if (i == selected_index) {
                this.lines[i]
                    // .transition().duration(1)
                    .attr("stroke-width", 2)
                    .attr("opacity", 1)
            }
            else {
                this.lines[i]
                    // .transition().duration(1)
                    .attr("stroke-width", 0)
                    .attr("opacity", 0.2)
            }
        }
    }

    unbold() {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i]
                .attr("stroke-width", 0)
                .attr("opacity", 0.8)
        }
    }
}