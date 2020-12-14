function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDataAvailable(dataset) {
  if (dataset["data"] != null) {
    return true;
  }
  return false;
}
async function draw(symbol) {
  console.log(`drawing.. ${symbol}`);
  document.getElementById("loader").style.display = "block";
  document.getElementById("content").style.display = "none";
  /* Config */
  const dimensions = {
    chart: {
      width: "455px",
    },
    table: {
      width: "910px",
      rowHeight: "20px",
    },
  };
  var nbars = 10
  const yearParser = d3.timeParse("%Y");
  // const startYear = yearParser(2009);
  // const endYear = yearParser(2020);

  /* Mediator */
  var mediator = new Mediator();
  var rootUrl = "https://notredame.alpha.lab.ai";
  var rootScoreUrl = "https://notredame2.alpha.lab.ai";
    
  if (symbol.includes(".")) {
    var exchange = symbol.split(".")[1];
  } else {
    var exchange = "US";
  }

  var priceSymbol
  if (symbol.includes(".")) {
    priceSymbol = symbol
  } else {
    priceSymbol = priceSymbol + '.US'
  }

  var authorizationToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4OTM0NTYwMDAsInVzZXJuYW1lIjoieW9ydCJ9.GGYlZFvQfYJTT3VU6owQXImwD3tsO9HICMG83sgSPYU";

  /* Data Loader*/
  // var priceRawData = await d3.json(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=M&from=1230791270&to=1594708119&token=brah5r7rh5rbgnjptnug`)
  // var icChartRaw = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var icLineDataSet = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var icTableraw = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var bsChartRaw = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=bs&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var bsTableRaw = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=bs&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var csChartDataSet = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=cf&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // var csTableDataSet = await d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=cf&freq=annual&token=brah5r7rh5rbgnjptnug`)

  // let promisepriceRawData = d3.json(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=M&from=1230791270&to=1594708119&token=brah5r7rh5rbgnjptnug`)
  // let promiseicChartRaw = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promiseicLineDataSet = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promiseicTableraw = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promisebsChartRaw = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=bs&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promisebsTableRaw = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=bs&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promisecsChartDataSet = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=cf&freq=annual&token=brah5r7rh5rbgnjptnug`)
  // let promisecsTableDataSet = d3.json(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=cf&freq=annual&token=brah5r7rh5rbgnjptnug`)

  let promiseUnicornSymbol = d3.text(`https://mka-api.alpha.lab.ai/finhub_to_unicorn?symbol=${symbol.split(".")[0]}&exchange=${exchange}`);
  try {
    var unicornSymbol = await promiseUnicornSymbol;
    unicornSymbol = unicornSymbol.slice(1,-1);
  } catch (e) {
    console.log(e)
  }
  
  let promisepriceRawData = d3.csv(
    //`${rootUrl}/api/candle?symbol=${symbol}&exchange=${exchange}`,
    `https://cors-container.herokuapp.com/https://eodhistoricaldata.com/api/eod/${unicornSymbol}?api_token=5d66a65679a7c9.784184268264`
    // {
    //   headers: new Headers({
    //     Authorization: authorizationToken,
    //   }),
    // }
  ,);

  let promiseicChartRaw = d3.json(
    `${rootUrl}/api/financials/ic/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );

  let promiseicAreaDataSet = d3.json(
    `${rootUrl}/api/financials/ic/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );

  let promiseicTableraw = d3.json(
    `${rootUrl}/api/financials/ic/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );
  let promisebsChartRaw = d3.json(
    `${rootUrl}/api/financials/bs/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );
  let promisebsTableRaw = d3.json(
    `${rootUrl}/api/financials/bs/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );
  let promisecsChartDataSet = d3.json(
    `${rootUrl}/api/financials/cf/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );
  let promisecsTableDataSet = d3.json(
    `${rootUrl}/api/financials/cf/annual?symbol=${symbol}&exchange=${exchange}`,
    {
      headers: new Headers({
        Authorization: authorizationToken,
      }),
    }
  );

  let promiseInfoDataSet = d3.json(
      `${rootUrl}/api/profile?symbol=${symbol}&exchange=${exchange}`,
      {
          headers: new Headers({
              Authorization: authorizationToken,
          }),
      }
  );
  
  let promiseScore = d3.json(
      `${rootScoreUrl}/api/find?expert=yong&tag=3.0&symbol=${symbol.split(".")[0]}&exchange=${exchange}`,
      {
          headers: new Headers({
              Authorization: authorizationToken,
          }),
      }
  );
  try {
    var priceRawData = await promisepriceRawData;
  } catch (e) {
    console.log(e)
  }

  try {
    var icChartRaw = await promiseicChartRaw;
  } catch (e) {
    console.log(e)
  }

  try {
    var icAreaDataSet = await promiseicAreaDataSet;
  } catch (e) {
    console.log(e)
  }

  try {
    var icTableraw = await promiseicTableraw;
  } catch (e) {
    console.log(e)
  }
  
  try {
    var bsChartRaw = await promisebsChartRaw;
  } catch (e) {
    console.log(e)
  }

  try {
    var bsTableRaw = await promisebsTableRaw;
  } catch (e) {
    console.log(e)
  }

  try {
    var csChartDataSet = await promisecsChartDataSet;
  } catch (e) {
    console.log(e)
  }

  try {
    var csTableDataSet = await promisecsTableDataSet;
  } catch (e) {
    console.log(e)
  }

  try {
    var infoDataSet = await promiseInfoDataSet;
  } catch (e) {
    console.log(e)
  }

  try {
    var scoreFromAPI = await promiseScore;
  } catch (e) {
    console.log(e)
  }
  
  if(icChartRaw["data"]["financials"] == null) {
    document.getElementById("content").style.display = "block";
    document.getElementById("loader").style.display = "none";
    alert("Sorry, " + symbol + " data is not ready");
    $('.searchbox').val(null).trigger("change"); 
    return;
  }
  var tmp_icChartdataset = icChartRaw["data"]["financials"];
  var tmp_xAccessor = (d) => d3.timeParse("%Y")(d.year);
  var endYear = d3.max(tmp_icChartdataset, tmp_xAccessor);
  endYear.setFullYear(endYear.getFullYear() + 1);
  var startYear = d3.max(tmp_icChartdataset, tmp_xAccessor);
  startYear.setFullYear(startYear.getFullYear() - nbars);
  console.log("startyear = " + startYear);
  console.log("endYear = " + endYear);
  
  
  document.getElementById("content").style.display = "block";
  document.getElementById("loader").style.display = "none";

  drawInfo(symbol, priceRawData, infoDataSet, scoreFromAPI);

  /* Price */
  // if (isDataAvailable(priceRawData)) {
  console.log(priceRawData)
  if(priceRawData!=null) {
    var priceDataset = [];
    // priceRawData = priceRawData["data"];
    for (var i = 0; i < priceRawData.length-1; i++) {
      priceDataset.push({
        close: parseFloat(priceRawData[i].Adjusted_close),
        unixtime: new Date(priceRawData[i].Date).getTime() / 1000,
        date: priceRawData[i].Date,
        volume: priceRawData[i].Volume,
      });
    }
    priceDataset = priceDataset.filter(
      (d) =>
        d3.timeParse("%s")(d.unixtime).getFullYear() >=
          startYear.getFullYear() &&
        d3.timeParse("%s")(d.unixtime).getFullYear() <= endYear.getFullYear() 
    );

    var accesors = [
      { name: "unixtime", accessor: (d) => d.unixtime },
      { name: "close", accessor: (d) => d.close },
    ];
    var priceChart = new PriceChart({
      element: "#price-chart",
      dimensions: {
        width: 455+24, // add additional year
        height: 284,
      },
      dataset: priceDataset,
      accesors: accesors,
      nbars: 10,
      startYear: startYear,
      endYear: endYear,
      mediator: mediator,
    });
    priceChart.draw();
    mediator.push(priceChart);
  } else{
    let tmp = d3.select("#price-chart");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 455)
        .attr("height", 284);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${455/2}px, ${284/2}px)`
      )
      .text("No Price Data Available");
  }

  /* StockInfo */

  /* IC Chart */
  if (isDataAvailable(icChartRaw)) {
    var icChartdataset = icChartRaw["data"]["financials"];
    const dateParser = d3.timeParse("%Y");

    var accesors = [
      { name: "revenue", accessor: (d) => d.revenue*1e6 },
      { name: "grossProfit", accessor: (d) => d.grossProfit*1e6 },
      { name: "netIncomeBeforeTaxes", accessor: (d) => d.netIncomeBeforeTaxes*1e6 },
      { name: "netIncome", accessor: (d) => d.netIncome*1e6 },
    ];

    var icChart = new SteppedLineChart({
      element: "#ic-chart",
      dimensions: {
        width: 455,
        height: 250,
      },
      dataset: icChartdataset,
      accesors: accesors,
      nbars: 10,
      startYear: startYear,
      endYear: endYear,
      mediator: mediator,
    });
    mediator.push(icChart);
    icChart.draw();
  } else{
    let tmp = d3.select("#ic-chart");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 455)
        .attr("height", 250);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${455/2}px, ${250/2}px)`
      )
      .text("No IC Data Available");
  }



  /* IC EPS */
  if (isDataAvailable(icAreaDataSet)) {
    icAreaDataSet = icAreaDataSet["data"]["financials"];
    icAreaDataSet = icAreaDataSet.filter((d) => d.year >= (d3.max(icAreaDataSet, (d) => d.year) - 10) );
    var accesors = [
      { name: "dilutedEPS", accessor: (d) => d.dilutedEPS },
    ];
    var colors = ["#8044b5"];
    var icAreaChart = new AreaChart({
      element: "#ic-areachart",
      dimensions: {
        width: 455,
        height: 50,
      },
      dataset: icAreaDataSet,
      accesors: accesors,
      nbars: 10,
      colors: colors,
      startYear: startYear,
      endYear: endYear,
      mediator: mediator,
    });
    icAreaChart.draw();
    mediator.push(icAreaChart);
  } else{
    let tmp = d3.select("#ic-areachart");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 455)
        .attr("height", 50);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${455/2}px, ${50/2}px)`
      )
      .text("No IC Data Available");
  }

  /* IC Table */
  if (isDataAvailable(icTableraw)) {
    icTableDataset = icTableraw["data"]["financials"];

    icTableDataset = icTableDataset.filter((d) => d.year >= (d3.max(icTableDataset, (d) => d.year) - 10));
    icTableDataset.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(icTableDataset.map((d) => d.year));
    tbody = [
      ["Revenue"]
        .concat(icTableDataset.map((d) => d.revenue*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Gross Profit"]
        .concat(icTableDataset.map((d) => d.grossProfit*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["EBT"]
        .concat(icTableDataset.map((d) => d.netIncomeBeforeTaxes*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Net Income"]
        .concat(icTableDataset.map((d) => d.netIncome*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["EPS"]
        .concat(icTableDataset.map((d) => d.dilutedEPS))
        .map((d, i) => ({ data: d, year: thead[i] })),
    ];
    var classesDict = {
      Revenue: "revenue",
      "Gross Profit": "grossProfit",
      EBT: "netIncomeBeforeTaxes",
      "Net Income": "netIncome",
      EPS: "dilutedEPS",
    };
    var icTable = new Table(
      {
        element: "#ic-table",
        dataset: icTableDataset,
        thead: thead,
        tbody: tbody,
        classesDict: classesDict,
        dimensions: {
          width: 910,
          height: 300,
        },
        startYear: startYear,
        endYear: endYear,
        mediator: mediator,
      },
      icChart,
      altChart=icAreaChart
    );
    mediator.push(icTable);

    icTable.draw();
  }
  else{
    let tmp = d3.select("#ic-table");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 910)
        .attr("height", 300);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${910/2}px, ${300/2}px)`
      )
      .text("No IC Data Available");
  }

  // await sleep(2000)
  // icChart.splitData()

  /* BS Chart */
  if (isDataAvailable(bsChartRaw)) {
    bsChartDataset = bsChartRaw["data"]["financials"];

    var accesors = [
      { name: "totalAssets", accessor: (d) => d.totalAssets*1e6 },
      { name: "totalLiabilities", accessor: (d) => d.totalLiabilities*1e6 },
      { name: "totalEquity", accessor: (d) => d.totalEquity*1e6 },
      //{ name: "cash", accessor: (d) => d.cash },
    ];

    var bsChart = new ALESteppedLineChart({
      element: "#bs-chart",
      dimensions: {
        width: 455,
        height: 200,
      },
      dataset: bsChartDataset,
      accesors: accesors,
      nbars: 10,
      startYear: startYear,
      endYear: endYear,
      mediator: mediator,
    });
    mediator.push(bsChart);
    bsChart.draw();
  }else{
    let tmp = d3.select("#bs-chart");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 455)
        .attr("height", 200);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${455/2}px, ${200/2}px)`
      )
      .text("No BS Data Available");
  }
  /* BS Table */
  if (isDataAvailable(bsTableRaw)) {
    bsTabledataset = bsTableRaw["data"]["financials"];

    bsTabledataset = bsTabledataset.filter((d) => d.year >= (d3.max(bsTabledataset, (d) => d.year) - 10));
    bsTabledataset.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(bsTabledataset.map((d) => d.year));
    tbody = [
      ["Assets"]
        .concat(bsTabledataset.map((d) => d.totalAssets*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Liability"]
        .concat(bsTabledataset.map((d) => d.totalLiabilities*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Equity"]
        .concat(bsTabledataset.map((d) => d.totalEquity*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      // ["Cash"]
      //   .concat(bsTabledataset.map((d) => d.cash))
      //   .map((d, i) => ({ data: d, year: thead[i] })),
    ];
    var classesDict = {
      "Assets": "totalAssets",
      "Liability": "totalLiabilities",
      "Equity": "totalEquity",
      //Cash: "cash",
    };
    var bsTable = new Table(
      {
        element: "#bs-table",
        dataset: bsTabledataset,
        thead: thead,
        tbody: tbody,
        classesDict: classesDict,
        dimensions: {
          width: 910,
          height: 200,
        },
        startYear: startYear,
        endYear: endYear,
        mediator: mediator,
      },
      bsChart
    );
    mediator.push(bsTable);

    bsTable.draw();
  }
  else{
    let tmp = d3.select("#bs-table");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 910)
        .attr("height", 200);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${910/2}px, ${200/2}px)`
      )
      .text("No BS Data Available");
  }
  // await sleep(2000)
  // icChart.deSplitData()

  /* CS Chart */
  if (isDataAvailable(csChartDataSet)) {
    csChartDataSet = csChartDataSet["data"]["financials"];
    csChartDataSet = csChartDataSet.filter((d) => d.year >= 2009);
    var accesors = [
      {
        name: "cashfromOperatingActivities",
        accessor: (d) => d.cashfromOperatingActivities*1e6,
      },
      {
        name: "cashfromFinancingActivities",
        accessor: (d) => d.cashfromFinancingActivities*1e6,
      },
      {
        name: "cashfromInvestingActivities",
        accessor: (d) => d.cashfromInvestingActivities*1e6,
      },
    ];
    var colors = ["#b8dee6", "#757de4", "#8044b5"];
    var csChart = new LinePointChart({
      element: "#cs-chart",
      dimensions: {
        width: 455,
        height: 200,
      },
      dataset: csChartDataSet,
      accesors: accesors,
      nbars: 10,
      colors: colors,
      startYear: startYear,
      endYear: endYear,
      mediator: mediator,
    });
    csChart.draw();
    mediator.push(csChart);
  }else{
    let tmp = d3.select("#cs-chart");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 455)
        .attr("height", 200);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${455/2}px, ${200/2}px)`
      )
      .text("No CS Data Available");
  }

  /* CS Table */
  if (isDataAvailable(csTableDataSet)) {
    csTableDataSet = csTableDataSet["data"]["financials"];
    csTableDataSet = csTableDataSet.filter((d) => d.year >= (d3.max(csTableDataSet, (d) => d.year) - 10));
    csTableDataSet.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(csTableDataSet.map((d) => d.year));
    tbody = [
      ["Operating"]
        .concat(csTableDataSet.map((d) => d.cashfromOperatingActivities*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Financing"]
        .concat(csTableDataSet.map((d) => d.cashfromFinancingActivities*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Investing"]
        .concat(csTableDataSet.map((d) => d.cashfromInvestingActivities*1e6))
        .map((d, i) => ({ data: d, year: thead[i] })),
    ];
    var classesDict = {
      Operating: "cashfromOperatingActivities",
      Financing: "cashfromFinancingActivities",
      Investing: "cashfromInvestingActivities",
    };
    var csTable = new Table(
      {
        element: "#cs-table",
        dataset: csTableDataSet,
        thead: thead,
        tbody: tbody,
        classesDict: classesDict,
        dimensions: {
          width: 910,
          height: 200,
        },
        startYear: startYear,
        endYear: endYear,
        mediator: mediator,
      },
      csChart
    );
    mediator.push(csTable);

    csTable.draw();
  }else{
    let tmp = d3.select("#cs-table");
    tmp.selectAll("*").remove();
    let empty = tmp.append("svg")
        .attr("width", 910)
        .attr("height", 200);
    empty.append('rect')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");
    empty.append("text")
      .attr("text-anchor", "middle")
      .style(
        "transform",
        `translate(${910/2}px, ${200/2}px)`
      )
      .text("No CS Data Available");
  }

  /* ETC */

  // await sleep(2000)
  // icChart.splitData()
}

async function main() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("content").style.display = "none";
  drawInfo("AAPL");
  draw("AAPL");
  
  $("form").submit(function (e) {
    e.preventDefault();
    var symbol = $("#symbolSearch").val()
    draw(symbol)
  });
}
main();
