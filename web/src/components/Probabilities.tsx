import { useEffect } from "react";
import Chart from "chart.js/auto";
import "../style.css";
import createBarChart from "./BarChart.tsx";

interface Props {
  predicted_class: string;
  probabilities: number[];
}

function Probabilities({ probabilities }: Props) {
  useEffect(() => {
    const ctx = document.getElementById(
      "modelResponseChart"
    ) as HTMLCanvasElement;

    let barChart: Chart | null = null;

    barChart = createBarChart(ctx, probabilities);

    return () => {
      if (barChart) barChart.destroy();
    };
  }, [probabilities]);

  return (
    <div id="probabilities">
      <canvas id="modelResponseChart"></canvas>
    </div>
  );
}

export default Probabilities;
