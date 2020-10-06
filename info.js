async function drawInfo(symbol, priceRawData, infoDataSet, scoreFromAPI) {
    console.log(`drawing info ${symbol}`);
    if (symbol.includes(".")) {
        var exchange = symbol.split(".")[1];
    } else {
        var exchange = "US";
    }

    // var rootUrl = "https://api.avantis.app";
    // var authorizationToken =
    //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4OTM0NTYwMDAsInVzZXJuYW1lIjoieW9ydCJ9.GGYlZFvQfYJTT3VU6owQXImwD3tsO9HICMG83sgSPYU";

    // let promisepriceRawData = d3.csv(
    // `http://18.141.209.89:8080/https://eodhistoricaldata.com/api/eod/${symbol}?api_token=5d66a65679a7c9.784184268264`
    // );

    // let promiseInfoDataSet = d3.json(
    //     `${rootUrl}/api/profile?symbol=${symbol}&exchange=${exchange}`,
    //     {
    //         headers: new Headers({
    //             Authorization: authorizationToken,
    //         }),
    //     }
    // );
    
    // let promiseScore = d3.json(
    //     `http://18.141.209.89:1324/api/find?expert=yong&tag=2.0&symbol=${symbol.split(".")[0]}&exchange=${exchange}`,
    //     {
    //         headers: new Headers({
    //             Authorization: authorizationToken,
    //         }),
    //     }
    // );


    // let priceRawData = await promisepriceRawData;
    // let infoDataSet = await promiseInfoDataSet;
    // let scoreFromAPI = await promiseScore;
    
    // console.log("info.js: priceRawData",symbol.split(".")[0],exchange, priceRawData);
    // console.log("info.js: infoDataSet",symbol.split(".")[0],exchange, infoDataSet);
    console.log("info.js: scoreFromAPI", scoreFromAPI);
    

    
    /*UPDATE INFO*/
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
        
        if (infoDataSet["data"]["ticker"].includes(".")) {
            var ticker = infoDataSet["data"]["ticker"].split(".")[0];
        } else {
            var ticker = infoDataSet["data"]["ticker"];
        }
        
        var currency = infoDataSet["data"]["currency"];
        var name = infoDataSet["data"]["name"];
        var sector = infoDataSet["data"]["gsector"];
    }
    d3.select("#information-currency").html(currency);
    d3.select("#information-symbol").html(exchange + ":" + ticker);
    d3.select("#information-name").html(name);
    d3.select("#information-sector").html(sector);
    d3.select("#information-desc").html(
        splitDesc[0] + splitDesc[1] + splitDesc[2]
    );
    
    /*UPDATE PRICE*/
    if (
        priceRawData == null ||
        priceRawData.length < 2
    ) {
        var close = "N/A";
        var closeToday = "N/A";
        var closePrev = "N/A";
        var chg = "N/A";
        var percentChg = "N/A";
    } else {
        var close = priceRawData;
        var closeToday = close[close.length - 2]['Close'];
        var closePrev = close[close.length - 3]['Close'];
        var chg = (closeToday - closePrev).toFixed(2);
        var percentChg = ((chg / closePrev) * 100).toFixed(2);
    }
    
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
    

    /*UPDATE SCORE*/
    
    if (scoreFromAPI[0] != null){
        var factorNames = scoreFromAPI[0].Data[0].Value;
        var factorScores = scoreFromAPI[0].Data[1].Value;

        console.log("info.js: factorNames", factorNames);
        console.log("info.js: factorScores", factorScores);
        
    }
    else{
        var factorNames = ['N/A','N/A','N/A','N/A','N/A','N/A'];
        var factorScores = [0,0,0,0,0,0];

        console.log("info.js: factorNames", factorNames);
        console.log("info.js: factorScores", factorScores);
    }
    

    
    var icrScore =  (factorScores[0]* 100).toFixed(0)
    var laScore =   (factorScores[1]* 100).toFixed(0)
    var ocqScore =  (factorScores[2]* 100).toFixed(0)
    var revScore =  (factorScores[3]* 100).toFixed(0)
    var valuationScore = (factorScores[4]* 100).toFixed(0)
//     var AVAScores = (factorScores[0]* 10).toFixed(2)
    var AVAScores = (((factorScores[0]*0.25)+
                      (factorScores[1]*0.15)+
                      (factorScores[2]*0.20)+
                      (factorScores[3]*0.15)+
                      (factorScores[4]*0.25)
                     )*10).toFixed(2)
        
    console.log("info.js: AVAScore", AVAScores);
    




    d3.select("#avascore").html(AVAScores);

    d3.select("#icr-text").html("Interest Coverage Ratio (" + icrScore + ")");
    d3.select("#la-text").html("Liquid Assets(" + laScore + ")");
    d3.select("#ocq-text").html("Operating Cashflow Quality  (" + ocqScore + ")");
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
