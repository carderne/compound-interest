/* global Chart */

function $(id) { return document.getElementById(id); }

const inDur = $("dur");
const inLump = $("lump");
const inCurr = $("curr");
const inUnit = $("unit");
const inGrowth = $("growth");
const inFeeA = $("feeA");
const inFeeB = $("feeB");
const ansDiff = $("ansDiff");
const ctx = $("canvas").getContext('2d');

let dur = 40;
let lump = 5;
let curr = "R";
let unit = "million";
let growth = 7;
let feeA = 0.1;
let feeB = 1.6;

inDur.oninput = update;
inLump.oninput = update;
inCurr.oninput = update;
inUnit.oninput = update;
inCurr.oninput = update;
inGrowth.oninput = update;
inFeeA.oninput = update;
inFeeB.oninput = update;

let chart;
let data;

function update() {
  try {
    let newData = parseForms();
    if (newData != data) {
      data = newData;
      setUnit();
      makeChart(data);
      updateWarnings(data);
    }
  } catch (err) {
    // do nothing
  }
}

function setUnit() {
  unit = inUnit.value;
  if (unit == "only") { unit = ""; }
  curr = inCurr.value;
}

function updateWarnings(data) {
  maxA = data.a[data.a.length - 1];
  maxB = data.b[data.b.length - 1];
  let lost = Math.abs(maxA - maxB).toFixed(1);
  let pclost = (100 * lost / Math.max(maxA, maxB)).toFixed(0);
  ansDiff.innerHTML = curr + " " + lost + " " + unit  + " (" + pclost + "%)";
}


function parseForms() {
  if (inDur.value != "" && inDur.value != null) { dur = parseFloat(inDur.value); }
  if (inLump.value != "" && inLump.value != null) { lump = parseFloat(inLump.value); }
  if (inGrowth.value != "" && inGrowth.value != null) { growth = parseFloat(inGrowth.value); }
  if (inFeeA.value != "" && inFeeA.value != null) { feeA = parseFloat(inFeeA.value); }
  if (inFeeB.value != "" && inFeeB.value != null) { feeB = parseFloat(inFeeB.value); }

  let lab = [];
  let lineA = [];
  let lineB = [];

  let a = lump;
  let b = lump;

  for (let i = 0; i <= dur; i++) {
    a = a * (100 + growth - feeA) / 100;
    b = b * (100 + growth - feeB) / 100;
    lab.push(i);
    lineA.push(a);
    lineB.push(b);
  }

  return {
    "lab": lab,
    "a": lineA,
    "b": lineB
  }
}


function makeChart(data) {
  let linedata = {
    labels: data.lab,
    datasets: [
      {
        label: "Fund A",
        data: data.a,
        borderColor: "rgba(57, 162, 174, 1)",
        backgroundColor: "rgba(57, 162, 174, 0.2)",
        borderCapStyle: "round",
        borderWidth: 4,
        pointBorderWidth: 0,
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        pointBorderColor: "rgba(0, 0, 0, 0)",
      },
      {
        label: "Fund B",
        data: data.b,
        borderColor: "rgba(87, 62, 174, 1)",
        backgroundColor: "rgba(87, 62, 174, 0.2)",
        borderCapStyle: "round",
        borderWidth: 4,
        pointBorderWidth: 0,
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        pointBorderColor: "rgba(0, 0, 0, 0)",
      }
    ]
  };

  let yLabel = "Value (" + unit + " " + curr + ")";
  if (unit == "") { yLabel = "Value (" + curr + ")"; }

  config = {
    type: "line",
    data: linedata,
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Year',
            fontSize: 20
          },
          gridLines: {
            drawBorder: false,
            lineWidth: 3,
            zeroLineWidth: 3,
            display: true,
            drawOnChartArea: false,
          },
          ticks: {
            fontSize: 14
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yLabel,
            fontSize: 20
          },
          gridLines: {
            drawBorder: false,
            lineWidth: 2,
            zeroLineWidth: 2
          },
          ticks: {
            fontSize: 16,
            beginAtZero: true,
            maxTicksLimit: 8,
          }
        }]
      },
      legend: {
        display: true
      },
      showTooltips: false,
      tooltips: {
        enabled: false
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }

  if (chart == undefined) {
    chart = new Chart(ctx, config);
  } else {
    chart.data = linedata;
    chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
    chart.update({duration: 0});
  }
}

window.onload = function() {
  update();
};
