/* global Chart */

function $(id) { return document.getElementById(id); }

const inAge = $("age");
const inEndAge = $("endAge");
const inLump = $("lump");
const inGrowth = $("growth");
const inFeeA = $("feeA");
const inFeeB = $("feeB");
const ctx = $("canvas").getContext('2d');
const ansA = $("ansA");
const ansB = $("ansB");
const ansDiff = $("ansDiff");

let age = 60;
let endAge = 100;
let lump = 5;
let growth = 7;
let feeA = 0.1;
let feeB = 1.6;

inAge.oninput = update;
inEndAge.oninput = update;
inLump.oninput = update;
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
      makeChart(data);
      updateWarnings(data);
    }
  } catch (err) {
    // do nothing
  }
}

function updateWarnings(data) {
  maxA = data.a[data.a.length - 1];
  maxB = data.b[data.b.length - 1];
  ansA.innerHTML = Math.round(maxA) + " million";
  ansB.innerHTML = Math.round(maxB) + " million";
  ansDiff.innerHTML = Math.abs(Math.round(maxA - maxB)) + " million";
}



function parseForms() {
  if (inAge.value != "" && inAge.value != null) { age = parseFloat(inAge.value); }
  if (inEndAge.value != "" && inEndAge.value != null) { endAge = parseFloat(inEndAge.value); }
  if (inLump.value != "" && inLump.value != null) { lump = parseFloat(inLump.value); }
  if (inGrowth.value != "" && inGrowth.value != null) { growth = parseFloat(inGrowth.value); }
  if (inFeeA.value != "" && inFeeA.value != null) { feeA = parseFloat(inFeeA.value); }
  if (inFeeB.value != "" && inFeeB.value != null) { feeB = parseFloat(inFeeB.value); }

  let lab = [];
  let lineA = [];
  let lineB = [];

  let a = lump;
  let b = lump;

  for (let i = age; i <= endAge; i++) {
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

  if (chart == undefined) {
    config = {
      type: "line",
      data: linedata,
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Age',
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
              labelString: 'Investment value (millions)',
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
              stepSize: 30,
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
    chart = new Chart(ctx, config);
  } else {
    chart.data = linedata;
    chart.update({duration: 0});
  }
}

window.onload = function() {
  update();
};
