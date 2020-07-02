/* global Chart */

function $(id) { return document.getElementById(id); }

const inAge = $("age");
const inLump = $("lump");
const inGrowth = $("growth");
const inFeeA = $("feeA");
const inFeeB = $("feeB");
const ctx = $("canvas").getContext('2d');
const ansA = $("ansA");
const ansB = $("ansB");
const ansDiff = $("ansDiff");

inAge.oninput = update;
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
  ansDiff.innerHTML = Math.round(maxA - maxB) + " million";
}

function parseForms() {
  let age = parseInt(inAge.value);
  let lump = parseFloat(inLump.value);
  let growth = (inGrowth.value) / 100;
  let feeA = (inFeeA.value) / 100;
  let feeB = (inFeeB.value) / 100;

  let lab = [];
  let lineA = [];
  let lineB = [];

  let a = lump;
  let b = lump;

  for (let i = age; i <= 100; i++) {
    a = a * (1 + growth - feeA);
    b = b * (1 + growth - feeB);
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
  let datasets = [
    {
      label: "a",
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
      label: "b",
      data: data.b,
      borderColor: "rgba(87, 62, 174, 1)",
      backgroundColor: "rgba(87, 62, 174, 0.2)",
      borderCapStyle: "round",
      borderWidth: 4,
      pointBorderWidth: 0,
      pointBackgroundColor: "rgba(0, 0, 0, 0)",
      pointBorderColor: "rgba(0, 0, 0, 0)",
    }
  ];

  if (chart == undefined) {
    config = {
      type: "line",
      data: {
        labels: data.lab,
        datasets: datasets
      },
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
          display: false
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
    chart.data.datasets.pop();
    chart.data.datasets = datasets;
    chart.update({duration: 0});
  }
}

window.onload = function() {
  update();
};
