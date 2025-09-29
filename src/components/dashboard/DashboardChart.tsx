import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlowData, ChemicalData, ElectricData } from '@/utils/dataStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartProps {
  flowData: FlowData[];
  chemicalData: ChemicalData[];
  electricData: ElectricData[];
  plant: 'kerenceng' | 'cidanau';
  date: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  flowData,
  chemicalData,
  electricData,
  plant,
  date,
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Plus Jakarta Sans',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        titleFont: {
          family: 'Plus Jakarta Sans',
        },
        bodyFont: {
          family: 'Plus Jakarta Sans',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.3)',
        },
        ticks: {
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.3)',
        },
        ticks: {
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
        },
      },
    },
  };

  const filterByDateAndPlant = (data: any[]) => {
    return data.filter(d => d.date === date && d.plant === plant);
  };

  const flowChartData = useMemo(() => {
    const data = filterByDateAndPlant(flowData);
    const labels = data.map(d => d.time);
    
    return {
      labels,
      datasets: [
        {
          label: 'Counter Air Baku (m³)',
          data: data.map(d => d.counter_air_baku_cipada),
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Counter PS I - WTP (m³)',
          data: data.map(d => d.counter_ps1_wtp),
          borderColor: '#1D4ED8',
          backgroundColor: 'rgba(29, 78, 216, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [flowData, date, plant]);

  const chemicalChartData = useMemo(() => {
    const data = filterByDateAndPlant(chemicalData);
    const labels = data.map(d => d.time);
    
    return {
      labels,
      datasets: [
        {
          label: 'PAC (kg)',
          data: data.map(d => d.pac),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 1,
        },
        {
          label: 'Kaporit (kg)',
          data: data.map(d => d.kaporit),
          backgroundColor: '#F59E0B',
          borderColor: '#F59E0B',
          borderWidth: 1,
        },
        {
          label: 'Soda Ash (kg)',
          data: data.map(d => d.soda_ash),
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
          borderWidth: 1,
        },
      ],
    };
  }, [chemicalData, date, plant]);

  const electricChartData = useMemo(() => {
    const data = filterByDateAndPlant(electricData);
    const labels = data.map(d => d.time);
    
    return {
      labels,
      datasets: [
        {
          label: 'Panel 1 (kWh)',
          data: data.map(d => d.kwh_panel1),
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
          borderWidth: 1,
        },
        {
          label: 'Panel 2 (kWh)',
          data: data.map(d => d.kwh_panel2),
          backgroundColor: '#F97316',
          borderColor: '#F97316',
          borderWidth: 1,
        },
        {
          label: 'Line 1 (kWh)',
          data: data.map(d => d.kwh_line1),
          backgroundColor: '#84CC16',
          borderColor: '#84CC16',
          borderWidth: 1,
        },
      ],
    };
  }, [electricData, date, plant]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Grafik Konsumsi - {plant.charAt(0).toUpperCase() + plant.slice(1)}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Data konsumsi untuk tanggal {new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="chemical">Chemical</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flow" className="mt-6">
            <div className="h-80">
              <Line data={flowChartData} options={chartOptions} />
            </div>
          </TabsContent>
          
          <TabsContent value="chemical" className="mt-6">
            <div className="h-80">
              <Bar data={chemicalChartData} options={chartOptions} />
            </div>
          </TabsContent>
          
          <TabsContent value="electric" className="mt-6">
            <div className="h-80">
              <Bar data={electricChartData} options={chartOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;