import Chart from "chart.js/auto";

function createBarChart(ctx: HTMLCanvasElement, probabilities: number[]) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      datasets: [
        {
          label: "Model Confidence",
          data: probabilities,
          backgroundColor: ["#44c767"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            callback: function (value) {
              return +value * 100 + "%";
            },
          },
          max: 1,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const data = context.dataset.data as number[];
              const decimal = data[+context.label];
              const tooltip =
                context.dataset.label + " " + (decimal * 100).toFixed(2) + "%";
              return tooltip;
            },
          },
        },
      },
    },
  });
}

export default createBarChart;
