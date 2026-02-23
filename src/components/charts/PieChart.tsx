import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type {
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
  height?: number;
}

const PieChart = ({ data, options, height }: PieChartProps) => {
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div style={{ height: height || 300 }}>
      <Pie data={data} options={options || defaultOptions} />
    </div>
  );
};

export default PieChart;
