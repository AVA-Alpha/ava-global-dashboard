class ALESteppedLineChart {
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
    this.dataset = this.dataset.slice(0, 12);

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
    var dataMaps = [];
    for (var i = 0; i < this.accesors.length; i++) {
      dataMaps.push(...this.dataset.map(this.accesors[i]["accessor"]));
    }
    dataMaps.push(0);
    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataMaps).map((d) => d * 1))
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
    this.colors = ["#b8dee6", "#e84a5f", "#99b898", "#7b2992"];
    var zeroGenerator = d3
      .area()
      .x((d) => this.xScale(this.xAccessor(d)))
      .y0(this.yScale(0))
      .y1(this.yScale(0))
      .curve(d3.curveStepBefore);

    //console.log((this.dataset.map(d => this.accesors[0]['accessor'](d))))
    this.highlightBoxes = [];

    // A:0
    i = 0;
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

    // END A

    // L:1
    i = 1;
    areaGenerators[i] = d3
      .area()
      .x((d) => this.xScale(this.xAccessor(d)))
      .y0((d) => this.yScale(this.accesors[2]["accessor"](d)))
      .y1((d) => this.yScale(this.accesors[i]["accessor"](d) + this.accesors[2]["accessor"](d)) )
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

    // END L

    // E:2
    i = 2;
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

    // END E

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
      .attr("fill", "rgb(108, 90, 214)")
      .attr("class", "modeBtn")
      .attr("width", "50px")
      .attr("height", "25px")
      .attr("x", 0)
      .attr("y", 0)
      .on("click", switchMode)
      .style("cursor", "pointer");

    this.bounds
      .append("text")
      .text("switch")
      .style("fill", "white")
      .attr("x", 5)
      .attr("y", 17)
      .on("click", switchMode)
      .style("cursor", "pointer");

    var that = this;
    function switchMode() {
      console.log("modeBtn clicked");
      if (that.splitted == false) {
        that.splitData();
      } else {
        that.deSplitData(onMouseMove);
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
      for (var i = 1; i < 3; i++) {
          if(i==1){
        valueArray.push({
          name: that.accesors[i]["name"],
          value: that.accesors[i]["accessor"](
            that.dataset.filter((d) => d.year == selectedYear)[0]
          )
          + that.accesors[2]["accessor"](
            that.dataset.filter((d) => d.year == selectedYear)[0]
          ),
        });
    }
    else {
        valueArray.push({
            name: that.accesors[i]["name"],
            value: that.accesors[i]["accessor"](
              that.dataset.filter((d) => d.year == selectedYear)[0]
            ),
          });
    }
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

    const xAxisGenerator = d3
      .axisTop()
      .scale(this.xScale)
      .tickFormat(function (d) {
        return d3.format("02d")(d.getFullYear() % 1000);
      });

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
      this.highlightBoxes[0].attr("visibility", "visible");
      this.selected_index = this.accesors.findIndex(
        (x) => x.name === this.selectedName
      );
      if (this.selected_index == -1) {
        this.selected_index = 2;
      }
      if (this.selected_index!=1){
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
    }
    else{ // Liability shift

        var endY = this.yScale(
              this.accesors[2]["accessor"](
                this.dataset.filter((d) => d.year == start.getFullYear())[0] 
              ),
          );
    
          var startY = this.yScale(

              (this.accesors[this.selected_index]["accessor"](
                this.dataset.filter((d) => d.year == start.getFullYear())[0]
              ) + this.accesors[2]["accessor"](
                this.dataset.filter((d) => d.year == start.getFullYear())[0] 
              ))
          );

    }
      this.highlightBoxes[0]
        .attr("x", this.xScale(start))
        // .attr("y", this.yScale(0) - (this.yScale(0) - startY))
        .attr("y", endY - (endY - startY))
        .attr("width", this.xScale(end) - this.xScale(start))
        // .attr("height", this.yScale(0) - startY)
        .attr("height", endY - startY);
    } else {
      for (var i = 0; i < this.highlightBoxes.length; i++) {
        var datamap = [];
        datamap.push(...this.dataset.map(this.accesors[i]["accessor"]));
        datamap.push(0);
        var newYScale = d3
          .scaleLinear()
          .domain(d3.extent(datamap))
          .range([
            this.dimensions.boundedHeight,
            1.05 *
              (this.dimensions.boundedHeight -
                this.dimensions.boundedHeight / this.accesors.length),
          ]);
        
          var startY =
          newYScale(
            d3.max([
              this.accesors[i]["accessor"](
                this.dataset.filter((d) => d.year == start.getFullYear())[0]
              ),
              0,
            ])
          ) -
          (this.dimensions.boundedHeight / this.accesors.length) *
            (this.accesors.length - i - 1);

        // var endY = this.yScale.range()[1] +
        // (this.dimensions.boundedHeight / this.accesors.length) * (i + 1)

        var endY =
          newYScale(
            d3.min([
              0,
              this.accesors[i]["accessor"](
                this.dataset.filter((d) => d.year == start.getFullYear())[0]
              ),
            ])
          ) -
          (this.dimensions.boundedHeight / this.accesors.length) *
            (this.accesors.length - i - 1);

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
          .attr("stroke-width", 0)
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
    this.focus.style("display", null);
    const mousePosition = d3.mouse(d3.event.currentTarget);
    const hoveredDate = that.xScale.invert(mousePosition[0]);
    var selectedYear = hoveredDate.getFullYear();
    var endYear = selectedYear + 1;
    const dateParser = d3.timeParse("%Y");
    that.mediator.highlightTime(dateParser(selectedYear), dateParser(endYear));
    // that.tableObject.highlightYear(selectedYear)

    // const hoveredValue = that.yScale.invert(mousePosition[1])
    var selIdx = Math.floor(
      that.accesors.length - ((that.yScale.range()[0] - mousePosition[1]) / (that.yScale.range()[0]/that.accesors.length))
    );
    that.bold(that.accesors[selIdx]["name"]);
    d3.select(that).raise();
  }
  splitData() {
    this.splitted = true;
    var areaGenerators = [];
    for (var i = 0; i < this.accesors.length; i++) {
      //this.highlightBoxes[i].attr("visibility", "visible");
      var datamap = [];
      datamap.push(...this.dataset.map(this.accesors[i]["accessor"]));
      datamap.push(0);
      console.log(datamap);
      this.newYScale = d3
        .scaleLinear()
        .domain(d3.extent(datamap))
        .range([
          this.dimensions.boundedHeight,
          1.05 *
            (this.dimensions.boundedHeight -
              this.dimensions.boundedHeight / this.accesors.length),
        ]);
      areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        // .y0(
        //   this.yScale.range()[1] +
        //     (this.dimensions.boundedHeight / this.accesors.length) * (i + 1)
        // )
        .y0(
          (d) =>
            this.newYScale(0) -
            (this.dimensions.boundedHeight / this.accesors.length) *
              (this.accesors.length - i - 1)
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

    // that.mediator.highlightTime(dateParser(selectedYear), dateParser(endYear));
    var that = this
    this.listeningRect
      .on('mousemove', function(d) { that._onMouseMoveSplitted(that) })
    //that.mediator.unHighlightTime();
  }

  deSplitData(onMouseMove) {
    this.splitted = false;
    var areaGenerators = [];
    for (var i = 0; i < this.accesors.length; i++) {
      this.highlightBoxes[i].attr("visibility", "hidden");
      if (i!=1){
          var y0 = this.yScale(0)
          var y1 = (d) => this.yScale(this.accesors[i]["accessor"](d))
      }
      else {
        y0 = (d) => this.yScale(this.accesors[2]["accessor"](d))
        y1 = (d) => this.yScale(this.accesors[i]["accessor"](d) + this.accesors[2]["accessor"](d))
      }
      areaGenerators[i] = d3
        .area()
        .x((d) => this.xScale(this.xAccessor(d)))
        .y0(y0)
        .y1(y1)
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
    this.listeningRect
      .on('mousemove', onMouseMove)
  }

  linkTable(tableObject) {
    this.tableObject = tableObject;
  }
}
