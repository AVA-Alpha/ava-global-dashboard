class SteppedLineChart {
  constructor(opts) {
    this.element = opts.element;
    this.dataset = opts.dataset;

    this.mediator = opts.mediator;

    this.accesors = opts.accesors;
    this.inputDimensions = opts.dimensions;
    this.nbars = opts.nbars;

    // add for visualization
    this.dataset.unshift(Object.assign({}, this.dataset[0]));
    this.dataset[0]["year"] = this.dataset[0]["year"] + 1;
    this.dataset = this.dataset.slice(0, 12)

    this.splitted = false;
  }

  async draw() {
    this.dateParser = d3.timeParse("%Y");

    this.xAccessor = (d) => this.dateParser(d.year);

    // 2. Create chart dimensions

    this.dimensions = {
      width: this.inputDimensions.width,
      height: this.inputDimensions.height,
      margin: {
        top: 50, //15
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

    // 3. Draw canvas

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

    // 4. Create scales
    var dataMaps = []
    for(var i=0; i<this.accesors.length; i++) {
        dataMaps.push(...this.dataset.map(this.accesors[i]['accessor']))
    }
    dataMaps.push(0)
    console.log(this.dataset)
    console.log(this.accesors)
    console.log(d3.extent(dataMaps)
    .map((d) => d * 1))
    this.yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(dataMaps)
          .map((d) => d * 1)
      )
      .range([this.dimensions.boundedHeight, 0]);
    //.nice()

    this.latestYear = d3.max(this.dataset, this.xAccessor);
    this.latestYear.setFullYear(this.latestYear.getFullYear());
    this.firstYear = d3.max(this.dataset, this.xAccessor);
    this.firstYear.setFullYear(this.firstYear.getFullYear() - this.nbars - 1);
    this.xScale = d3
      .scaleTime()
      //.domain(d3.extent(this.dataset, xAccessor))
      .domain([this.firstYear, this.latestYear])
      .range([0, this.dimensions.boundedWidth]);

    // 5. Draw data
    var lineGenerators = [];
    this.lines = [];
    var areaGenerators = [];
    this.areas = [];
    var that = this;
    this.colors = ["#b8dee6", "#757de4", "#8044b5", "#7b2992"];
    var zeroGenerator = d3
      .area()
      .x((d) => this.xScale(this.xAccessor(d)))
      .y0(this.yScale(0))
      .y1(this.yScale(0))
      .curve(d3.curveStepBefore);

    //console.log((this.dataset.map(d => this.accesors[0]['accessor'](d))))
    this.highlightBoxes = [];

    for (var i = 0; i < this.accesors.length; i++) {
      areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        .y0(that.yScale(0))
        .y1((d) => this.yScale(this.accesors[i]["accessor"](d)))
        .curve(d3.curveStepBefore);

      this.areas[i] = this.bounds
        .append("svg")
        .append("path")
        .attr(
          "d",
          zeroGenerator(
            this.dataset.filter((d) => d.year >= this.firstYear.getFullYear())
          )
        )
        .attr("stroke", d3.color(this.colors[i]))
        .attr("stroke-width", 0)
        .attr("fill", d3.color(this.colors[i]).copy({ opacity: 0.8 }))
        .attr("opacity", 0.2);

      //console.log(this.dataset)
      this.areas[i]
        .transition()
        .duration(1000)
        .attr(
          "d",
          areaGenerators[i](
            this.dataset.filter((d) => d.year >= this.firstYear.getFullYear())
          )
        )
        .attr("stroke", d3.color(this.colors[i]))
        .attr("stroke-width", 0)
        .attr("fill", d3.color(this.colors[i]).copy({ opacity: 0.8 }))
        .attr("opacity", 0.7);

      this.highlightBoxes.push(
        this.bounds
          .append("rect")
          .attr("visibility", "hidden")
          .attr("id", "highlight-box")
          .attr("opacity", 0.3)
      );
    }

    this.highlightBoxes[0].attr("visibility", "visible");

    this.listeningRect = this.bounds
      .append("rect")
      .attr("class", "listening-rect")
      .attr("width", this.dimensions.boundedWidth)
      .attr("height", this.dimensions.boundedHeight)
      .on("mousemove", onMouseMove)
      .on("mouseout", onMouseOut);

    this.modeBtn = this.bounds
      .append("rect")
      .attr("class", "modeBtn")
      .attr("width", '20px')
      .attr("height", '20px')
      .on('click', switchMode)

    var that = this;
    function switchMode() {
      console.log("modeBtn clicked")
      if (that.splitted == false) { 
        that.splitData()
      }
      else{
        that.deSplitData()
      }
    }
    function onMouseMove() {
      that.focus.style("display", null);
      const mousePosition = d3.mouse(this);
      const hoveredDate = that.xScale.invert(mousePosition[0]);
      var selectedYear = hoveredDate.getFullYear();
      var endYear = selectedYear + 1;
      const dateParser = d3.timeParse("%Y");
      that.mediator.highlightTime(
        dateParser(selectedYear),
        dateParser(endYear)
      );
      // that.tableObject.highlightYear(selectedYear)

      const hoveredValue = that.yScale.invert(mousePosition[1]);
      var valueArray = [];
      for (var i = 0; i < that.accesors.length; i++) {
        valueArray.push({
          name: that.accesors[i]["name"],
          value: that.accesors[i]["accessor"](
            that.dataset.filter((d) => d.year == selectedYear)[0]
          ),
        });
      }
      valueArray = valueArray.filter(
        (data) => hoveredValue < data.value || hoveredValue < 0
      );
      valueArray.sort(function (a, b) {
        return a.value - b.value;
      });
      that.bold(valueArray[0]["name"]);
      // d3.select(this).raise();
    }

    const dateParser = d3.timeParse("%Y");

    function onMouseOut() {
      // that.highlightTime(dateParser(2019), dateParser(2020))
      that.mediator.unHighlightTime();
      that.unbold();
    }

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft().scale(this.yScale);

    // const yAxis = this.bounds.append("g")
    //  .call(yAxisGenerator)

    const xAxisGenerator = d3.axisTop().scale(this.xScale);

    const xAxis = this.bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${-this.dimensions.margin.top + 30}px)`);

    // d3.selectAll(".tick text")
    //     .attr('transform', `translateX(-${this.xScale.bandWidth()/2})`);

    // 7. Focus item
    this.focus = this.bounds.append("g").attr("class", "tooltip");

    this.focus
      .append("line")
      .attr("class", "tooltip-line tooltip-start-date")
      .attr("y1", this.yScale(0))
      .attr("y2", this.yScale(this.dimensions.boundedHeight))
      .attr("stroke", "DarkGreen")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke-dasharray", "3px")
      .attr("opacity", 1);

    this.focus
      .append("line")
      .attr("class", "tooltip-line tooltip-end-date")
      .attr("y1", this.yScale(0))
      .attr("y2", this.yScale(this.dimensions.boundedHeight))
      .attr("stroke", "DarkGreen")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke-dasharray", "3px")
      .attr("opacity", 1);

    // this.highlightTime(dateParser(2019), dateParser(2020))
  }

  highlightTime(start, end) {
    // const startY = this.yScale(this.dataset.filter(d => d.year == start.getFullYear() )[0]['revenue'])

    // const startY = this.yScale.range()[1]
    //console.log(this.dataset.filter(d => d.year == start.getFullYear()))
    // const startY = this.yScale(this.dataset.filter(d => d.year == start.getFullYear())[0][this.selectedName])

    // const startY = this.yScale(this.dataset[this.selected_index][0]['revenue'])

    //const endY = this.yScale(this.dataset.filter(d => d.year == d3.min([end.getFullYear() , d3.max(this.dataset, d => d.year)]))[0]['revenue'])

    //var focusHeight = d3.max([startY, endY])
    if (this.splitted == false) {
      this.highlightBoxes[0].attr("visibility", "visible")
      this.selected_index = this.accesors.findIndex(
        (x) => x.name === this.selectedName
      );
      if (this.selected_index == -1) {
        this.selected_index = 0;
      }
      var startY = this.yScale(
        this.accesors[this.selected_index]["accessor"](
          this.dataset.filter((d) => d.year == start.getFullYear())[0]
        )
      );
      this.highlightBoxes[0]
        .attr("x", this.xScale(start))
        // .attr("y", this.yScale(0) - (this.yScale(0) - startY))
        .attr("y", this.yScale.range()[0] - (this.yScale.range()[0] - startY))
        .attr("width", this.xScale(end) - this.xScale(start))
        // .attr("height", this.yScale(0) - startY)
        .attr("height", this.yScale.range()[0] - startY);

    } else {
      for (var i = 0; i < this.highlightBoxes.length; i++) {
        var newYScale = d3
          .scaleLinear()
          .domain(d3.extent(this.dataset, this.accesors[i]["accessor"]))
          .range([
            this.dimensions.boundedHeight,
            1.05 *
              (this.dimensions.boundedHeight -
                this.dimensions.boundedHeight / this.accesors.length),
        ]);
        var startY = newYScale(this.accesors[i]["accessor"](this.dataset.filter((d) => d.year == start.getFullYear())[0])) -
        (this.dimensions.boundedHeight / this.accesors.length) * (this.accesors.length - i - 1)

        var endY = this.yScale.range()[1] +
        (this.dimensions.boundedHeight / this.accesors.length) * (i + 1)

        this.highlightBoxes[i]
          .attr("visibility", "visible")
          .attr("x", this.xScale(start))
          // .attr("y", this.yScale(0) - (this.yScale(0) - startY))
          .attr("y", endY - (endY - startY))
          .attr("width", this.xScale(end) - this.xScale(start))
          // .attr("height", this.yScale(0) - startY)
          .attr("height", endY - startY);
  

        
      }
    }
  }

  unHighlightTime() {
    for (var i = 0; i < this.highlightBoxes.length; i++) {
      this.highlightBoxes[i].attr("visibility", "hidden");
    }
  }

  bold(name) {
    this.selectedName = name;
    this.selected_index = this.accesors.findIndex((x) => x.name === name);
    for (var i = 0; i < this.areas.length; i++) {
      if (i == this.selected_index) {
        this.areas[i]
          // .transition().duration(1)
          .attr("stroke-width", 2)
          .attr("opacity", 1);
      } else {
        this.areas[i]
          // .transition().duration(1)
          .attr("stroke-width", 0)
          .attr("opacity", 0.2);
      }
    }
  }

  unbold() {
    for (var i = 0; i < this.areas.length; i++) {
      this.areas[i].attr("stroke-width", 0).attr("opacity", 0.8);
    }
  }
  _onMouseMoveSplitted(that) {
    that.focus.style("display", null);
    const mousePosition = d3.mouse(this);
    const hoveredDate = that.xScale.invert(mousePosition[0]);
    var selectedYear = hoveredDate.getFullYear();
    var endYear = selectedYear + 1;
    const dateParser = d3.timeParse("%Y");
    that.mediator.highlightTime(dateParser(selectedYear), dateParser(endYear));
    // that.tableObject.highlightYear(selectedYear)

    // const hoveredValue = that.yScale.invert(mousePosition[1])
    var selIdx = Math.floor(
      (mousePosition[1] - that.yScale.range()[1]) / this.accesors.length
    );
    that.bold(valueArray[selIdx]["name"]);
    d3.select(this).raise();
  }
  splitData() {
    this.splitted = true;
    var areaGenerators = [];
    for (var i = 0; i < this.accesors.length; i++) {
      this.highlightBoxes[i].attr("visibility", "visible");
      this.newYScale = d3
        .scaleLinear()
        .domain(d3.extent(this.dataset, this.accesors[i]["accessor"]))
        .range([
          this.dimensions.boundedHeight,
          1.05 *
            (this.dimensions.boundedHeight -
              this.dimensions.boundedHeight / this.accesors.length),
        ]);
      areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        .y0(
          this.yScale.range()[1] +
            (this.dimensions.boundedHeight / this.accesors.length) * (i + 1)
        )
        // .y1(d => ( this.yScale(this.accesors[i]['accessor'](d)) ) - ((this.dimensions.boundedHeight / this.accesors.length) * (this.accesors.length-i-1)))
        .y1(
          (d) =>
            this.newYScale(this.accesors[i]["accessor"](d)) -
            (this.dimensions.boundedHeight / this.accesors.length) *
              (this.accesors.length - i - 1)
        )
        .curve(d3.curveStepBefore);

      this.areas[i]
        .transition()
        .duration(1000)
        .attr(
          "d",
          areaGenerators[i](
            this.dataset.filter((d) => d.year >= this.firstYear.getFullYear())
          )
        )
        // .attr("stroke", d3.color(this.colors[i]))
        .attr("stroke", d3.color(this.colors[i]))
        .attr("stroke-width", 0)
        .attr("fill", d3.color(this.colors[i]).copy({ opacity: 0.8 }))
        .attr("opacity", 0.7);
    }
    // var that = this
    // this.listeningRect
    //   .on('mousemove', function(d) { this._onMouseMoveSplitted(that) })
  }

  deSplitData() {
    this.splitted = false;
    var areaGenerators = [];
    for (var i = 0; i < this.accesors.length; i++) {
      this.highlightBoxes[i].attr("visibility", "hidden");
      areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(this.accesors[i]["accessor"](d)))
        .curve(d3.curveStepBefore);

      this.areas[i]
        .transition()
        .duration(1000)
        .attr(
          "d",
          areaGenerators[i](
            this.dataset.filter((d) => d.year >= this.firstYear.getFullYear())
          )
        )
        .attr("stroke", d3.color(this.colors[i]))
        .attr("stroke-width", 0)
        .attr("fill", d3.color(this.colors[i]).copy({ opacity: 0.8 }))
        .attr("opacity", 0.7);
    }
    this.highlightBoxes[0].attr("visibility", "visible");
  }

  linkTable(tableObject) {
    this.tableObject = tableObject;
  }
}
