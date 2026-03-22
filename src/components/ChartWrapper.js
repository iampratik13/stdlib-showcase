'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 500,
    easing: 'easeInOutQuart',
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#4A4A6A',
        font: { family: "'Inter', sans-serif", size: 12 },
        usePointStyle: true,
        pointStyleWidth: 8,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#1A1A2E',
      bodyColor: '#4A4A6A',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      titleFont: { family: "'Inter', sans-serif", weight: 600 },
      bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
  },
  scales: {
    x: {
      grid: { color: '#F0F0F5' },
      ticks: {
        color: '#8E8EA9',
        font: { family: "'Inter', sans-serif", size: 11 },
        maxTicksLimit: 15,
      },
      border: { color: '#E5E7EB' },
    },
    y: {
      grid: { color: '#F0F0F5' },
      ticks: {
        color: '#8E8EA9',
        font: { family: "'JetBrains Mono', monospace", size: 11 },
      },
      border: { color: '#E5E7EB' },
    },
  },
};

export default function ChartWrapper({ type = 'line', data, options = {}, height = 320 }) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: { ...defaultOptions.plugins, ...options.plugins },
    scales: {
      x: { ...defaultOptions.scales.x, ...(options.scales?.x || {}) },
      y: { ...defaultOptions.scales.y, ...(options.scales?.y || {}) },
    },
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <ChartComponent data={data} options={mergedOptions} />
    </div>
  );
}
