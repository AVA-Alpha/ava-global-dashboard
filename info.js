async function drawInfo(symbol) {
    console.log(`drawing info ${symbol}`);
    if (symbol.includes(".")) {
        var exchange = symbol.split(".")[1];
    } else {
        var exchange = "US";
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

    let promiseScoreBlankV4 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=4.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    let promiseScoreBlankV5 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=5.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    let promiseScoreBlankV6 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=6.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    let promiseScoreBlankV7 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=7.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    let promiseScoreBlankV8 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=8.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    let promiseScoreBlankV9 = d3.json(
        `http://18.141.209.89:1324/api/find?expert=blank&tag=9.0`,
        {
            headers: new Headers({
                Authorization: authorizationToken,
            }),
        }
    );

    function getScoreAPI(symbol, ScoreAPI, multiplier, decimalpalces) {
        var scoreObject = Object.keys(ScoreAPI).map((key) => ScoreAPI[key]);
        var name = symbol.split(".")[0];
        var score = null;

        for (var i = 0; i < scoreObject.length; i++) {
            if (scoreObject[i].Symbol == name) {
                var scoreData = scoreObject[i].Data
                console.log("info.js scoreData: ", scoreData );
                for (var j = 0; j < scoreData.length; j++) {
                    console.log("info.js scoreData[j].Key: ", scoreData[j].Key);
                    if (scoreData[j].Key === 'scores') {
                        var scoreValue = scoreData[j].Value;
                        console.log("info.js scoreValue: ", scoreValue);
                        score = scoreValue[scoreValue.length - 1];
                        score = (score * multiplier).toFixed(decimalpalces)
                        break;
                    }
                }
                break;
            }
        }
        return score;
    }


    let priceRawData = await promisepriceRawData;
    let infoDataSet = await promiseInfoDataSet;

    let ScoreBlankV4 = await promiseScoreBlankV4;
    let ScoreBlankV5 = await promiseScoreBlankV5;
    let ScoreBlankV6 = await promiseScoreBlankV6;
    let ScoreBlankV7 = await promiseScoreBlankV7;
    let ScoreBlankV8 = await promiseScoreBlankV8;
    let ScoreBlankV9 = await promiseScoreBlankV9;

    let AVAScore = {
        blankV4: getScoreAPI(symbol, ScoreBlankV4, 100, 0),
        blankV5: getScoreAPI(symbol, ScoreBlankV5, 100, 0),
        blankV6: getScoreAPI(symbol, ScoreBlankV6, 100, 0),
        blankV7: getScoreAPI(symbol, ScoreBlankV7, 100, 0),
        blankV8: getScoreAPI(symbol, ScoreBlankV8, 100, 0),
        blankV9: getScoreAPI(symbol, ScoreBlankV9, 10, 2)
    };


    // console.log("info.js: Prices", priceRawData["data"]);
    // console.log("info.js: Score", AVAScore);

    console.log("info.js AVAScore: ", AVAScore);


    if (
        priceRawData["data"] === null ||
        priceRawData["data"]["s"] === "no_data"
    ) {
        var close = "N/A";
        var closeToday = "N/A";
        var closePrev = "N/A";
        var chg = "N/A";
        var percentChg = "N/A";
    } else {
        var close = priceRawData["data"]["c"];
        var closeToday = close[close.length - 1];
        var closePrev = close[close.length - 2];
        var chg = (closeToday - closePrev).toFixed(2);
        var percentChg = ((chg / closePrev) * 100).toFixed(2);
    }

    console.log("info.js: Info", infoDataSet);
    if (
        infoDataSet["data"] === null ||
        jQuery.isEmptyObject(infoDataSet["data"]) ||
        jQuery.isEmptyObject(infoDataSet)
    ) {
        var description = "N/A";
        var splitDesc = "N/A";
        var exchange = "N/A";
        var ticker = "N/A";
        var currency = "N/A";
        var name = "N/A";
        var sector = "N/A";
    } else {
        var description = infoDataSet["data"]["description"];
        var splitDesc = description.split(".");
        var exchange = infoDataSet["data"]["exchange"].split(" ")[0];
        var ticker = infoDataSet["data"]["ticker"];
        var currency = infoDataSet["data"]["currency"];
        var name = infoDataSet["data"]["name"];
        var sector = infoDataSet["data"]["gsector"];
    }

    //     console.log(AVAScore["data"])
    if (AVAScore === null) {
        var avascore = "N/A";
        var icrScore = "N/A";
        var laScore = "N/A";
        var ocqScore = "N/A";
        var revScore = "N/A";
        var valuationScore = "N/A";
    } else {
        var icrScore = AVAScore.blankV4;
        var laScore = AVAScore.blankV5;
        var ocqScore = AVAScore.blankV6;
        var revScore = AVAScore.blankV7;
        var valuationScore = AVAScore.blankV8;
        var avascore = AVAScore.blankV9;
    }

    d3.select("#avascore").html(avascore);

    d3.select("#information-currency").html(currency);
    d3.select("#information-price").html(closeToday);

    if (chg >= 0) {
        $("#information-chg-arrow")
            .removeClass("information-downarrow")
            .addClass("information-uparrow");
        d3.select("#information-chg").html("+" + chg + "|" + percentChg + "%");
    } else {
        $("#information-chg-arrow")
            .removeClass("information-uparrow")
            .addClass("information-downarrow");
        d3.select("#information-chg").html(chg + "|" + percentChg + "%");
    }

    d3.select("#information-symbol").html(exchange + ":" + ticker);
    d3.select("#information-name").html(name);
    d3.select("#information-sector").html(sector);
    d3.select("#information-desc").html(
        splitDesc[0] + splitDesc[1] + splitDesc[2]
    );

    d3.select("#icr-text").html("Metric A (" + icrScore + ")");
    d3.select("#la-text").html("Metric B (" + laScore + ")");
    d3.select("#ocq-text").html("Metric C (" + ocqScore + ")");
    d3.select("#rev-text").html("Metric D (" + revScore + ")");
    d3.select("#valuation-text").html("Metric E (" + valuationScore + ")");

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
    };

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
