async function drawInfo(symbol) {
    console.log(`drawing info ${symbol}`)
    if(symbol.includes('.')){
        var exchange = symbol.split('.')[1]
      }
      else {
        var exchange = 'US'
      }
    var rootUrl = "https://api.avantis.app";
    var authorizationToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4OTM0NTYwMDAsInVzZXJuYW1lIjoieW9ydCJ9.GGYlZFvQfYJTT3VU6owQXImwD3tsO9HICMG83sgSPYU";

    let promisepriceRawData = d3.json(
        `${rootUrl}/api/candle?symbol=${symbol}&exchange=${exchange}`,
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

    let priceRawData = await promisepriceRawData;
    let infoDataSet = await promiseInfoDataSet;

    var description = infoDataSet["data"]["description"];
    var splitDesc = description.split(".");

    var close = priceRawData["data"]["c"];
    var closeToday = close[close.length - 1];
    var closePrev = close[close.length - 2];
    var chg = (closeToday - closePrev).toFixed(2);
    var percentChg = ((chg / closePrev) * 100).toFixed(2);

    var avascore = 6.18;
    var icrScore = 62;
    var laScore = 45;
    var ocqScore = 51;
    var revScore = 65;
    var valuationScore = 81;

    d3.select("#avascore").html(avascore);

    d3.select("#information-currency").html(infoDataSet["data"]['currency']);
    d3.select("#information-price").html(closeToday);

    if (chg >= 0) {
        $('#information-chg-arrow').addClass('information-uparrow');
        d3.select("#information-chg").html(
            "+" + chg + "\t\t\t\t|\t\t\t\t" + percentChg + "%"
        );
    } else {
        $('#information-chg-arrow').addClass('information-downarrow');
        d3.select("#information-chg").html(
            "-" + chg + "\t\t\t\t|\t\t\t\t" + percentChg + "%"
        );
    }

    d3.select("#information-symbol").html(
        infoDataSet["data"]["exchange"].split(" ")[0] +
        ":" +
        infoDataSet["data"]["ticker"]
    );
    d3.select("#information-name").html(infoDataSet["data"]["name"]);
    d3.select("#information-sector").html(infoDataSet["data"]["gsector"]);
    d3.select("#information-desc").html(
        splitDesc[0] + splitDesc[1] + splitDesc[2]
    );

    d3.select("#icr-text").html("Interest Coverage Ratio (" + icrScore + ")");
    d3.select("#la-text").html("Liquid Assets (" + laScore + ")");
    d3.select("#ocq-text").html("Operating Cashflow Quality (" + ocqScore + ")");
    d3.select("#rev-text").html("Revenue (" + revScore + ")");
    d3.select("#valuation-text").html("Valuation (" + valuationScore + ")");

    // bar chart
    chartOption = {
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },
        scales: {
            xAxes: [
                {
                    display: false,
                    stacked: true,
                },
            ],
            yAxes: [
                {
                    display: false,
                    stacked: true,
                },
            ],
        }, // scales
        plugins: {
            // PROVIDE PLUGINS where you can specify custom style
            datalabels: {
                align: "start",
                anchor: "end",
                backgroundColor: null,
                borderColor: null,
                borderRadius: 4,
                borderWidth: 1,
                offset: 10,
                formatter: function (value, context) {
                    return context.chart.data.labels[context.dataIndex]; //Provide value of the percentage manually or through data
                },
            },
        },
    }

    new Chart(document.getElementById("icr-score"), {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [
                {
                    //value bar
                    data: [icrScore],
                    backgroundColor: "#833ebe",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    //background bar
                    data: [100 - icrScore],
                    backgroundColor: "#f2eff6",
                    hoverBackgroundColor: "#f2eff6",
                    datalabels: {
                        display: false,
                    },
                },
            ],
        },
        options: chartOption, // options
    });

    new Chart(document.getElementById("la-score"), {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [
                {
                    //value bar
                    data: [laScore],
                    backgroundColor: "#833ebe",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    //background bar
                    data: [100 - laScore],
                    backgroundColor: "#f2eff6",
                    hoverBackgroundColor: "#f2eff6",
                    datalabels: {
                        display: false,
                    },
                },
            ],
        },
        options: chartOption, // options
    });

    new Chart(document.getElementById("ocq-score"), {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [
                {
                    //value bar
                    data: [ocqScore],
                    backgroundColor: "#833ebe",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    //background bar
                    data: [100 - ocqScore],
                    backgroundColor: "#f2eff6",
                    hoverBackgroundColor: "#f2eff6",
                    datalabels: {
                        display: false,
                    },
                },
            ],
        },
        options: chartOption, // options
    });

    new Chart(document.getElementById("rev-score"), {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [
                {
                    //value bar
                    data: [revScore],
                    backgroundColor: "#833ebe",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    //background bar
                    data: [100 - revScore],
                    backgroundColor: "#f2eff6",
                    hoverBackgroundColor: "#f2eff6",
                    datalabels: {
                        display: false,
                    },
                },
            ],
        },
        options: chartOption, // options
    });

    new Chart(document.getElementById("valuation-score"), {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [
                {
                    //value bar
                    data: [valuationScore],
                    backgroundColor: "#833ebe",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    //background bar
                    data: [100 - valuationScore],
                    backgroundColor: "#f2eff6",
                    hoverBackgroundColor: "#f2eff6",
                    datalabels: {
                        display: false,
                    },
                },
            ],
        },
        options: chartOption, // options
    });
}