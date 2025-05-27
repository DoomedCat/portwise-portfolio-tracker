
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TimeRange, MarketData } from '../types';
import { getPortfolioHistory } from '../utils/marketData';
import { usePortfolio } from '../contexts/PortfolioContext';

interface PortfolioChartProps {
  marketData: MarketData;
}

const PortfolioChart = ({ marketData }: PortfolioChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [chartData, setChartData] = useState<any[]>([]);
  const { refreshKey } = usePortfolio();

  const ranges: { label: string; value: TimeRange }[] = [
    { label: '1Д', value: '1D' },
    { label: '1Н', value: '1W' },
    { label: '1М', value: '1M' },
    { label: '1Г', value: '1Y' },
    { label: 'MAX', value: 'MAX' }
  ];

  useEffect(() => {
    const historyData = getPortfolioHistory(selectedRange);
    const formattedData = historyData.map(item => ({
      date: new Date(item.t).toLocaleDateString('ru-RU', { 
        month: 'short', 
        day: 'numeric',
        ...(selectedRange === '1D' && { hour: '2-digit', minute: '2-digit' })
      }),
      value: item.c
    }));
    setChartData(formattedData);
  }, [selectedRange, refreshKey]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">График портфеля</h2>
        <div className="flex bg-secondary rounded-xl p-1">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range.value
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis 
                dataKey="date" 
                stroke="#A0A0A0"
                fontSize={12}
              />
              <YAxis 
                stroke="#A0A0A0"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#7E3FF2" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#7E3FF2" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                Добавьте активы в портфель для отображения графика
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;
