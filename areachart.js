class AreaChart {
  constructor(opts) {
    this.element = opts.element;
    this.dataset = opts.dataset;
    this.mediator = opts.mediator;
    this.accesors = opts.accesors;
    this.inputDimensions = opts.dimensions;
    this.nbars = opts.nbars;
    this.colors = opts.colors;

    // add for visualization
    this.dataset.unshift(Object.assign({}, this.dataset[0]));
    this.dataset[0]["year"] = this.dataset[0]["year"] + 1;
  }

  async draw(symbol) {
    this.dateParser = d3.timeParse("%Y");
    this.xAccessor = (d) => this.dateParser(d.year);

    this.dimensions = {
      width: this.inputDimensions.width,
      height: this.inputDimensions.height,
      margin: {
        top: 2, //15
        right: 15, //15
        bottom: 0, //40
        left: 15, //60
      },
    };
    this.dimensions.boundedWidth =
      this.dimensions.width -
      this.dimensions.margin.left -
      this.dimensions.margin.right;
    this.dimensions.boundedHeight =
      this.dimensions.height -
      this.dimensions.margin.top -
      this.dimensions.margin.bottom;

    this.wrapper = d3.select(this.element);
    this.wrapper.selectAll("*").remove();
    this.wrapper = this.wrapper
      .append("svg")
      .attr("width", this.dimensions.width)
      .attr("height", this.dimensions.height);

    this.bounds = this.wrapper
      .append("g")
      .style(
        "transform",
        `translate(${this.dimensions.margin.left}px, ${this.dimensions.margin.top}px)`
      );

    this.bounds.append("path").attr("class", "area");

    var dataMaps = [];
    for (var i = 0; i < this.accesors.length; i++) {
      dataMaps.push(...this.dataset.map(this.accesors[i]["accessor"]));
    }
    dataMaps.push(0);
    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataMaps))
      .range([this.dimensions.boundedHeight, 0])
      .nice();

    this.latestYear = d3.max(this.dataset, this.xAccessor);
    this.latestYear.setFullYear(this.latestYear.getFullYear());
    this.firstYear = d3.max(this.dataset, this.xAccessor);
    this.firstYear.setFullYear(this.firstYear.getFullYear() - this.nbars - 1);
    this.xScale = d3
      .scaleTime()
      //.domain(d3.extent(this.dataset, xAccessor))
      //.domain(d3.extent(this.dataset, this.xAccessor))
      .domain([this.firstYear, this.latestYear])
      .range([0, this.dimensions.boundedWidth]);

    this.areaGenerators = [];
    this.areas = [];
    this.dots = [];
    for (var i = 0; i < this.accesors.length; i++) {
      this.areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(this.accesors[i]["accessor"](d)))
        .curve(d3.curveStepBefore);

      this.areas[i] = this.bounds
        .append("path")
        .attr("class", "area")
        .attr("d", this.areaGenerators[i](this.dataset))
        .style("stroke", this.colors[i])
        .style("fill", this.colors[i])
        .style("opacity", 0.5);
    }

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft().scale(this.yScale);

    // const yAxis = this.bounds.append("g")
    //     .call(yAxisGenerator)
    //     .style("transform", `translateX(${
    //         this.dimensions.margin.left + 20
    //         }px)`)

    const xAxisGenerator = d3.axisBottom().scale(this.xScale);

    // const xAxis = this.bounds.append("g")
    //     .call(xAxisGenerator)
    //     .style("transform", `translateY(${
    //         -this.dimensions.margin.top + 20
    //         }px)`)

    this.highlightBox = this.bounds
      .append("rect")
      .attr("id", "highlight-box")
      .attr("fill", "DarkGreen")
      .attr("opacity", 0.3);
    const yearParser = d3.timeParse("%Y");
    // this.highlightTime(yearParser(2016), yearParser(2017))

    var that = this;
    this.listeningRect = this.bounds
      .append("rect")
      .attr("class", "listening-rect")
      .attr("width", this.dimensions.boundedWidth)
      .attr("height", this.dimensions.boundedHeight)
      .on("mousemove", function () {
        const mousePosition = d3.mouse(this);
        const hoveredDate = that.xScale.invert(mousePosition[0]);
        var selectedYear = hoveredDate.getFullYear();
        var endYear = selectedYear + 1;
        const dateParser = d3.timeParse("%Y");
        that.mediator.highlightTime(
          dateParser(selectedYear),
          dateParser(endYear)
        );
      })
      .on("mouseout", function () {
        that.mediator.unHighlightTime();
      });
  }

  highlightTime(start, end) {
    // const startY = this.yScale.range()[1]
    // const startY = this.yScale(this.accesors[0]['accessor'](this.dataset.filter(d => d.year == start.getFullYear())[0]))

    // this.highlightBox
    //     .attr('visibility', 'visible')
    //     .attr("x", this.xScale(start))
    //     .attr("y", this.yScale.range()[0] - (this.yScale.range()[0] - startY))
    //     .attr("width", this.xScale(end) - this.xScale(start))
    //     .attr("height", this.yScale.range()[0] - startY)

    this.highlightBox.attr("visibility", "visible");
    this.selected_index = this.accesors.findIndex(
      (x) => x.name === this.selectedName
    );
    if (this.selected_index == -1) {
      this.selected_index = 0;
    }
    var startY = this.yScale(
      d3.max([
        0,
        this.accesors[this.selected_index]["accessor"](
          this.dataset.filter((d) => d.year == start.getFullYear())[0]
        ),
      ])
    );

    var endY = this.yScale(
      d3.min([
        0,
        this.accesors[this.selected_index]["accessor"](
          this.dataset.filter((d) => d.year == start.getFullYear())[0]
        ),
      ])
    );
    this.highlightBox
      .attr("x", this.xScale(start))
      // .attr("y", this.yScale(0) - (this.yScale(0) - startY))
      .attr("y", endY - (endY - startY))
      .attr("width", this.xScale(end) - this.xScale(start))
      // .attr("height", this.yScale(0) - startY)
      .attr("height", endY - startY);
  }

  unHighlightTime(start, end) {
    this.highlightBox.attr("visibility", "hidden");
  }

  bold(name) {
    console.log(name)
    console.log(this.accesors)
    var selected_index = this.accesors.findIndex((x) => x.name === name);
    console.log(this.areas[0])
    for (var i = 0; i < this.areas.length; i++) {
      if (i == selected_index) {
        this.areas[i]
          // .transition().duration(1)
          .attr("stroke-width", 0)
          .style("opacity", 1);
      } else {
        this.areas[i]
          // .transition().duration(1)
          .attr("stroke-width", 0)
          .style("opacity", 0.2);
      }
    }
  }

  unbold() {
    for (var i = 0; i < this.areas.length; i++) {
      this.areas[i].style("stroke-width", 0).style("opacity", 0.8);
    }
  }
}
