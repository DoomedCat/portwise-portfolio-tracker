
import { useState } from 'react';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TimeRange } from '../types';
import { getAssetPrices } from '../utils/marketData';

interface AssetModalProps {
  ticker: string;
  onClose: () => void;
}

const AssetModal = ({ ticker, onClose }: AssetModalProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');

  const ranges: { label: string; value: TimeRange }[] = [
    { label: '1Д', value: '1D' },
    { label: '1Н', value: '1W' },
    { label: '1М', value: '1M' },
    { label: '1Г', value: '1Y' },
    { label: 'MAX', value: 'MAX' }
  ];

  const priceData = getAssetPrices(ticker, selectedRange);
  const chartData = priceData.map(item => ({
    date: new Date(item.t).toLocaleDateString('ru-RU', { 
      month: 'short', 
      day: 'numeric' 
    }),
    price: item.c
  }));

  const currentPrice = priceData[priceData.length - 1]?.c || 0;
  const previousPrice = priceData[priceData.length - 2]?.c || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{ticker}</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(currentPrice)}
              </span>
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)} 
                ({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex bg-secondary rounded-xl p-1">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

        <div className="h-80">
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
                domain={['dataMin * 0.98', 'dataMax * 1.02']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#9F66FF" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#9F66FF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
