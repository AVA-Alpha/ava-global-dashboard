class Table {
  constructor(opts, chartObj, altChart=null) {
    this.chartObj = chartObj;
    this.altChart = altChart;
    this.element = opts.element;
    this.mediator = opts.mediator;
    this.dataset = opts.dataset;
    this.thead = opts.thead;
    this.tbody = opts.tbody;
    this.classesDict = opts.classesDict;
  }

  async _loadData(symbol) {
    var raw = await d3.json(
      `https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`
    );
    this.dataset = raw["financials"];

    this.dataset = this.dataset.filter((d) => d.year >= 2009);
    this.dataset.sort(function (a, b) {
      return a.year - b.year;
    });
    this.thead = ["Name"].concat(this.dataset.map((d) => d.year));
    this.tbody = [
      ["revenue"]
        .concat(this.dataset.map((d) => d.revenue))
        .map((d, i) => ({ data: d, year: this.thead[i] })),
      ["grossProfit"]
        .concat(this.dataset.map((d) => d.grossProfit))
        .map((d, i) => ({ data: d, year: this.thead[i] })),
      ["netIncomeBeforeTaxes"]
        .concat(this.dataset.map((d) => d.netIncomeBeforeTaxes))
        .map((d, i) => ({ data: d, year: this.thead[i] })),
      ["netIncome"]
        .concat(this.dataset.map((d) => d.netIncome))
        .map((d, i) => ({ data: d, year: this.thead[i] })),
    ];
    //console.log(this.tbody)
  }

  async draw(symbol) {
    // await this._loadData(symbol)
    const YearParser = d3.timeParse("%Y");
    const dateAccessor = (d) => dateParser(d.year);

    var table = d3.select(this.element);
    table.selectAll("*").remove();
    table = table.append("table");

    const numberOfRows = 60;

    table
      .append("thead")
      .append("tr")
      .selectAll("thead")
      .data(this.thead)
      .enter()
      .append("th")
      .text((d) => d)
      .attr("class", "");

    const body = table.append("tbody");

    var isNumber = function isNumber(value) {
      return typeof value === "number" && isFinite(value);
    };
    const tooltip = d3.select("#tooltip");

    var that = this;
    this.tbody.forEach((d) => {
      d[1]["growth"] = 0;
      for (var i = 2; i < d.length; i++) {
        d[i]["growth"] = (d[i]["data"] - d[i - 1]["data"] ) / Math.abs(d[i - 1]["data"]);
      }
    });

    
    this.tbody.forEach((d) => {
      body
        .append("tr")
        .selectAll("td")
        .data(d)
        .enter()
        .append("td")
        .text(function (x) {
          if (isNumber(x["data"])) {
            if (x["data"] >= 0) {
              return d3.format(",.3s")(x["data"]);
            }
            if (x["data"] < 0) {
              return "(" + d3.format(",.2s")(Math.abs(x["data"])) + ")";
            }
          }
          console.log(x["data"])
          if(x["data"] == null){
            return '-'
          }
          return x["data"];
        })
        // .attr("class", x => `y${x['year']} ${d[0]['data']} table-cell`)
        .attr("class", function (x) {
          var classes = `y${x["year"]} ${
            that.classesDict[d[0]["data"]]
          } table-cell`;
          if (x["year"] == "") {
            classes += " td-name";
          } else {
            classes += " td-data";
          }
          return classes;
        })
        .style("color", function (x) {
          if (isNumber(x["data"])) {
            if (x["data"] >= 0) {
              return "#727272";
            }
            if (x["data"] < 0) {
              return "red";
            }
          }
          return "#444646";
        })
      //.style("background", column => column.background && column.background(d))
      //.style("transform", column => column.transform && column.transform(d))
    });

    d3.selectAll('.td-data')
        .filter(function(x){ return (isNumber(x["growth"]) && x["growth"]!=0); })
        .append('span')
        .text(d => `Growth: ${d3.format(".02%")(d['growth'])}`)
        .style("color", function (x) {
            if (isNumber(x["growth"])) {
              if (x["growth"] >= 0) {
                return 'green';
              }
              if (x["growth"] < 0) {
                return "red";
              }
            }
            return "#444646";
          })
        
    var that = this;
    const dateParser = d3.timeParse("%Y");
    d3.select(`${this.element}`)
      .selectAll(`td`)
      .filter(function () {
        return !this.classList.contains("yName");
      })
      .on("mouseover", function (d) {
        that.chartObj.bold(this.classList[1]);
        if(that.altChart!=null){
          that.altChart.bold(this.classList[1]);
        }
        that.mediator.highlightTime(dateParser(d.year), dateParser(d.year + 1));
      })
      .on("mouseleave", (d) => {
        // this.highlightTime(dateParser(d.year))
        that.mediator.unHighlightTime();
        this.chartObj.unbold();
        if(this.altChart!=null){
          this.altChart.unbold();
        }
      });
  }

  highlightTime(start) {
    var allCol = d3.selectAll(`.table-cell`).style("background", "#f8f9fa");
    var yearCol = d3.selectAll(`.y${start.getFullYear()}`);
    yearCol.style("background", "#d7ecec");
  }

  unHighlightTime(year) {
    var yearCol = d3.selectAll(`.td-data`);
    yearCol.style("background", "#f8f9fa");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
