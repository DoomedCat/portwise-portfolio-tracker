
import { MarketData, PriceData, TimeRange } from '../types';

// Mock market data for demonstration
const generateMockData = (): MarketData => {
  const tickers = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN'];
  const data: MarketData = {};
  
  tickers.forEach(ticker => {
    const basePrice = Math.random() * 200 + 50;
    const dailyData: PriceData[] = [];
    
    // Generate 365 days of data
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation * (Math.random()));
      
      dailyData.push({
        t: date.toISOString().split('T')[0],
        c: Math.round(price * 100) / 100
      });
    }
    
    data[ticker] = {
      D: dailyData,
      W: dailyData.filter((_, index) => index % 7 === 0),
      M: dailyData.filter((_, index) => index % 30 === 0)
    };
  });
  
  return data;
};

let marketDataCache: MarketData | null = null;

export const getMarketData = (): MarketData => {
  if (!marketDataCache) {
    marketDataCache = generateMockData();
  }
  return marketDataCache;
};

export const getAssetPrices = (ticker: string, range: TimeRange): PriceData[] => {
  const data = getMarketData()[ticker];
  if (!data) return [];
  
  const now = new Date();
  let startDate = new Date();
  
  switch (range) {
    case '1D':
      startDate.setDate(now.getDate() - 1);
      break;
    case '1W':
      startDate.setDate(now.getDate() - 7);
      break;
    case '1M':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '1Y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'MAX':
      return data.D;
  }
  
  return data.D.filter(item => new Date(item.t) >= startDate);
};

export const getPortfolioHistory = (range: TimeRange): PriceData[] => {
  const portfolio = JSON.parse(localStorage.getItem('portfolio') || '{}');
  const marketData = getMarketData();
  
  if (Object.keys(portfolio).length === 0) return [];
  
  const prices = getAssetPrices(Object.keys(portfolio)[0], range);
  
  return prices.map(pricePoint => {
    const totalValue = Object.entries(portfolio).reduce((total, [ticker, quantity]) => {
      const assetPrices = getAssetPrices(ticker, range);
      const priceAtDate = assetPrices.find(p => p.t === pricePoint.t);
      return total + (priceAtDate ? priceAtDate.c * (quantity as number) : 0);
    }, 0);
    
    return {
      t: pricePoint.t,
      c: totalValue
    };
  });
};
