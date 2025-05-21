import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface BarData {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

const CandleChart = ({ symbol }: { symbol: string }) => {
  const [seriesData, setSeriesData] = useState<{ x: Date; y: number[] }[]>([]);

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      background: '#1E1E1E'
    },
    theme: {
      mode: 'dark'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#cccccc'
        }
      },
      axisBorder: {
        color: '#444'
      },
      axisTicks: {
        color: '#444'
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#cccccc'
        }
      },
      axisBorder: {
        color: '#444'
      },
      axisTicks: {
        color: '#444'
      }
    },
    tooltip: {
      theme: 'dark'
    },
    grid: {
      borderColor: '#333'
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#16C784',   // verde para subida
          downward: '#EF4444'  // rojo para bajada
        }
      }
    }
  });

  // Cargar datos con cookies
  useEffect(() => {
    const fetchBarsData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/alpaca/bars/${symbol}`, {
          method: 'GET',
          credentials: 'include', // necesario para cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener datos de barras: ${response.status}`);
        }

        const data: BarData[] = await response.json();

        const transformedData = data.map(item => ({
          x: new Date(item.t),
          y: [item.o, item.h, item.l, item.c]
        }));

        setSeriesData(transformedData);
      } catch (error) {
        console.error('Error cargando datos del gráfico:', error);
      }
    };

    fetchBarsData();
  }, [symbol]);

  // Actualizar el título del gráfico
  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: {
        ...prevOptions.title,
        text: `Candlestick Chart - ${symbol}`
      }
    }));
  }, [symbol]);

  return (
    <div className="bg-[#1E1E1E] rounded-md shadow-md p-4 h-full text-white">
      <ReactApexChart
        options={chartOptions}
        series={[{ data: seriesData }]}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CandleChart;
