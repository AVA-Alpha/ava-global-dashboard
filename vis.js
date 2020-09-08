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

  const yearParser = d3.timeParse("%Y");
  const startYear = yearParser(2009);
  const endYear = yearParser(2020);

  /* Mediator */
  var mediator = new Mediator();
  var rootUrl = "https://api.avantis.app";
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

  let promisepriceRawData = d3.csv(
    //`${rootUrl}/api/candle?symbol=${symbol}&exchange=${exchange}`,
    `http://18.141.209.89:8080/https://eodhistoricaldata.com/api/eod/${symbol}?api_token=5d66a65679a7c9.784184268264`
    // {
    //   headers: new Headers({
    //     Authorization: authorizationToken,
    //   }),
    // }
  );

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

  let priceRawData = await promisepriceRawData;
  let icChartRaw = await promiseicChartRaw;
  let icAreaDataSet = await promiseicAreaDataSet;
  let icTableraw = await promiseicTableraw;
  let bsChartRaw = await promisebsChartRaw;
  let bsTableRaw = await promisebsTableRaw;
  let csChartDataSet = await promisecsChartDataSet;
  let csTableDataSet = await promisecsTableDataSet;

  /* Price */
  // if (isDataAvailable(priceRawData)) {
  if(priceRawData!=NaN) {
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
    console.log(priceDataset)
    priceDataset = priceDataset.filter(
      (d) =>
        d3.timeParse("%s")(d.unixtime).getFullYear() >=
          startYear.getFullYear() &&
        d3.timeParse("%s")(d.unixtime).getFullYear() <= endYear.getFullYear()
    );
    console.log(priceDataset)

    var accesors = [
      { name: "unixtime", accessor: (d) => d.unixtime },
      { name: "close", accessor: (d) => d.close },
    ];
    var priceChart = new PriceChart({
      element: "#price-chart",
      dimensions: {
        width: 455,
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
  }

  /* StockInfo */

  /* IC Chart */
  if (isDataAvailable(icChartRaw)) {
    var icChartdataset = icChartRaw["data"]["financials"];
    const dateParser = d3.timeParse("%Y");

    var accesors = [
      { name: "revenue", accessor: (d) => d.revenue },
      { name: "grossProfit", accessor: (d) => d.grossProfit },
      { name: "netIncomeBeforeTaxes", accessor: (d) => d.netIncomeBeforeTaxes },
      { name: "netIncome", accessor: (d) => d.netIncome },
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
  }

  /* IC EPS */
  if (isDataAvailable(icAreaDataSet)) {
    icAreaDataSet = icAreaDataSet["data"]["financials"];
    icAreaDataSet = icAreaDataSet.filter((d) => d.year >= 2009);
    var accesors = [
      { name: "costofRevenueTotal", accessor: (d) => d.costofRevenueTotal },
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
  }

  /* IC Table */
  if (isDataAvailable(icTableraw)) {
    icTableDataset = icTableraw["data"]["financials"];

    icTableDataset = icTableDataset.filter((d) => d.year >= 2009);
    icTableDataset.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(icTableDataset.map((d) => d.year));
    tbody = [
      ["Revenue"]
        .concat(icTableDataset.map((d) => d.revenue))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Gross Profit"]
        .concat(icTableDataset.map((d) => d.grossProfit))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["EBT"]
        .concat(icTableDataset.map((d) => d.netIncomeBeforeTaxes))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Net Income"]
        .concat(icTableDataset.map((d) => d.netIncome))
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
      icChart
    );
    mediator.push(icTable);

    icTable.draw();
  }

  // await sleep(2000)
  // icChart.splitData()

  /* BS Chart */
  if (isDataAvailable(bsChartRaw)) {
    bsChartDataset = bsChartRaw["data"]["financials"];

    var accesors = [
      { name: "totalAssets", accessor: (d) => d.totalAssets },
      { name: "totalLiabilities", accessor: (d) => d.totalLiabilities },
      { name: "totalEquity", accessor: (d) => d.totalEquity },
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
  }
  /* BS Table */
  if (isDataAvailable(bsTableRaw)) {
    bsTabledataset = bsTableRaw["data"]["financials"];

    bsTabledataset = bsTabledataset.filter((d) => d.year >= 2009);
    bsTabledataset.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(bsTabledataset.map((d) => d.year));
    tbody = [
      ["Total Assets"]
        .concat(bsTabledataset.map((d) => d.totalAssets))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Total Liability"]
        .concat(bsTabledataset.map((d) => d.totalLiabilities))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Total Equity"]
        .concat(bsTabledataset.map((d) => d.totalEquity))
        .map((d, i) => ({ data: d, year: thead[i] })),
      // ["Cash"]
      //   .concat(bsTabledataset.map((d) => d.cash))
      //   .map((d, i) => ({ data: d, year: thead[i] })),
    ];
    var classesDict = {
      "Total Assets": "totalAssets",
      "Total Liability": "totalLiabilities",
      "Total Equity": "totalEquity",
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
  // await sleep(2000)
  // icChart.deSplitData()

  /* CS Chart */
  if (isDataAvailable(csChartDataSet)) {
    csChartDataSet = csChartDataSet["data"]["financials"];
    csChartDataSet = csChartDataSet.filter((d) => d.year >= 2009);
    var accesors = [
      {
        name: "cashfromOperatingActivities",
        accessor: (d) => d.cashfromOperatingActivities,
      },
      {
        name: "cashfromFinancingActivities",
        accessor: (d) => d.cashfromFinancingActivities,
      },
      {
        name: "cashfromInvestingActivities",
        accessor: (d) => d.cashfromInvestingActivities,
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
  }

  /* CS Table */
  if (isDataAvailable(csTableDataSet)) {
    csTableDataSet = csTableDataSet["data"]["financials"];
    csTableDataSet = csTableDataSet.filter((d) => d.year >= 2009);
    csTableDataSet.sort(function (a, b) {
      return a.year - b.year;
    });
    thead = [""].concat(csTableDataSet.map((d) => d.year));
    tbody = [
      ["Operating"]
        .concat(csTableDataSet.map((d) => d.cashfromOperatingActivities))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Financing"]
        .concat(csTableDataSet.map((d) => d.cashfromFinancingActivities))
        .map((d, i) => ({ data: d, year: thead[i] })),
      ["Investing"]
        .concat(csTableDataSet.map((d) => d.cashfromInvestingActivities))
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
  }

  /* ETC */

  // await sleep(2000)
  // icChart.splitData()
}
async function main() {
  drawInfo("ADVANC.bk");
  draw("ADVANC.bk");
  
  $("form").submit(function (e) {
    e.preventDefault();
    var symbol = $("#symbolSearch").val()
    drawInfo(symbol);
    draw(symbol)
  });
}
main();
