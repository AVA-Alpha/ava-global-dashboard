async function drawInfo(symbol, priceRawData, infoDataSet, scoreFromAPI) {
    console.log(`drawing info ${symbol}`);
    if (symbol.includes(".")) {
        var exchange = symbol.split(".")[1];
        var tmp_sufix = exchange.toString().toUpperCase()
    } else {
        var exchange = "US";
    }
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

    var exhange_objs = {
        AS: "AMSTERDAM", AT: "ATHENS", AX: "AUSTRALIA", BA: "BUENOS AIRES", BC: "COLOMBIA", BD: "BUDAPEST", BE: "BERLIN", BK: "THAILAND", BO: "BOMBAY", BR: "BRUSSEL", CN: "CANADA", CO: "COPENHAGEN", CR: "CARACAS", DB: "DUBAI", DE: "XETRA", DU: "DUESSELDORF", F: "DEUTSCHE", HE: "HELSINKI", HK: "HONGKONG", HM: "HAMBURG", IC: "ICELAND", IR: "IRISH", IS: "ISTANBUL", JK: "INDONESIA", JO: "JOHANNESBURG", KL: "MALASIA", KQ: "KOSDAQ", KS: "KOREA", L: "LONDON", LS: "LISBON", MC: "MADRID", ME: "MOSCOW", MI: "ITALY", MU: "MUENCHEN", MX: "MEXICAN", NE: "NEO", NS: "INDIA", NZ: "NEWZEALAND", OL: "OSLO", PA: "PARIS", PR: "PRAGUE", QA: "QATAR", RG: "RIGA", SA: "BRAZIL", SG: "BOERSE", SI: "SINGAPORE", SN: "SANTIAGO", SR: "SAUDI", SS: "SHANGHAI", ST: "NORDIC", SW: "SWISS", SZ: "SHENZHEN", T: "TOKYO", TA: "TELAVIV", TL: "TALLINN", TO: "TORONTO", TW: "TAIWAN", V: "TSX", VI: "VIENNA", VN: "VIETNAM", VS: "VILNIUS", WA: "WARSAW"
    };
    if (symbol.includes(".")) {
        //         console.log("info.js: SUFFIX: ", tmp_sufix);
        //console.log("info.js: EXCHANGE: ", exhange_objs[tmp_sufix]);
        exchange = exhange_objs[tmp_sufix]
    }

    if (exchange == 'NEW') {
        exchange = 'NYSE'
    }


    d3.select("#information-currency").html(currency);
    d3.select("#information-symbol").html(exchange + ": " + ticker);
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

    var float_price = parseFloat(closeToday).toFixed(2);
    if (float_price >= 10000) {
        var price_withCommas = Number(float_price).toLocaleString('en', { minimumFractionDigits: 0 });
    }
    else {
        var price_withCommas = Number(float_price).toLocaleString('en', { minimumFractionDigits: 2 });
    }

    d3.select("#information-price").html(price_withCommas);
    if (chg >= 0) {
        d3.select("#information-chg").html('&#9650; ' + "+" + chg + " (+" + percentChg + "%)");
        document.getElementById("information-chg").style.color = "green";
        // $("#information-chg-arrow")
        //     .removeClass("information-downarrow")
        //     .addClass("information-uparrow");
    } else {
        d3.select("#information-chg").html('&#9660; ' + chg + " (" + percentChg + "%)");
        document.getElementById("information-chg").style.color = "red";
        // $("#information-chg-arrow")
        //     .removeClass("information-uparrow")
        //     .addClass("information-downarrow");
    }


    /*UPDATE SCORE*/

    if (scoreFromAPI[0] != null) {
        var factorNames = scoreFromAPI[0].Data[0].Value;
        var factorScores = scoreFromAPI[0].Data[1].Value;

        console.log("info.js: factorNames", factorNames);
        console.log("info.js: factorScores", factorScores);

    }
    else {
        var factorNames = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
        var factorScores = [0, 0, 0, 0, 0, 0];

        console.log("info.js: factorNames", factorNames);
        console.log("info.js: factorScores", factorScores);
    }



    var icrScore = (factorScores[0] * 100).toFixed(0)
    var laScore = (factorScores[1] * 100).toFixed(0)
    var ocqScore = (factorScores[2] * 100).toFixed(0)
    var revScore = (factorScores[3] * 100).toFixed(0)
    var valuationScore = (factorScores[4] * 100).toFixed(0)
    //     var AVAScores = (factorScores[0]* 10).toFixed(2)
    var AVAScores = (((factorScores[0] * 0.25) +
        (factorScores[1] * 0.15) +
        (factorScores[2] * 0.20) +
        (factorScores[3] * 0.15) +
        (factorScores[4] * 0.25)
    ) * 10).toFixed(2)

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
