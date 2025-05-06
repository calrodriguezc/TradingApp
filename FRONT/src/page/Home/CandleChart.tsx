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
        show: true
      }
    },
    title: {
      text: `Candlestick Chart - ${symbol}`,
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  });

  // Actualizamos data cuando cambia el symbol
  useEffect(() => {
    const fetchBarsData = async () => {
      const response = await fetch(`http://localhost:8080/api/bars/${symbol}`);
      const data: BarData[] = await response.json();

      const transformedData = data.map(item => ({
        x: new Date(item.t),
        y: [item.o, item.h, item.l, item.c]
      }));

      setSeriesData(transformedData);
    };

    fetchBarsData();
  }, [symbol]);

  // Actualizamos título cuando cambia symbol
  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: { ...prevOptions.title, text: `Candlestick Chart - ${symbol}` }
    }));
  }, [symbol]);

  return (
    <div>
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
