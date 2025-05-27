
import { MarketData, PriceData, TimeRange } from '../types';
import { getPortfolioAtTime } from './portfolio';

// Mock market data for demonstration with hourly data
const generateMockData = (): MarketData => {
  const tickers = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN'];
  const data: MarketData = {};
  
  tickers.forEach(ticker => {
    const basePrice = Math.random() * 200 + 50;
    const dailyData: PriceData[] = [];
    const hourlyData: PriceData[] = [];
    
    // Generate 365 days of data
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variation * (Math.random()));
      
      dailyData.push({
        t: date.toISOString().split('T')[0],
        c: Math.round(price * 100) / 100
      });
      
      // Generate 24 hours of data for recent days (last 7 days)
      if (i <= 7) {
        for (let h = 0; h < 24; h++) {
          const hourlyDate = new Date(date);
          hourlyDate.setHours(h);
          const hourlyVariation = (Math.random() - 0.5) * 0.02;
          const hourlyPrice = price * (1 + hourlyVariation);
          
          hourlyData.push({
            t: hourlyDate.toISOString(),
            c: Math.round(hourlyPrice * 100) / 100
          });
        }
      }
    }
    
    data[ticker] = {
      D: dailyData,
      W: dailyData.filter((_, index) => index % 7 === 0),
      M: dailyData.filter((_, index) => index % 30 === 0),
      H: hourlyData
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
  let sourceData = data.D;
  
  switch (range) {
    case '1D':
      startDate.setDate(now.getDate() - 1);
      sourceData = data.H.length > 0 ? data.H : data.D;
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
  
  return sourceData.filter(item => new Date(item.t) >= startDate);
};

export const getPortfolioHistory = (range: TimeRange): PriceData[] => {
  const marketData = getMarketData();
  const tickers = Object.keys(marketData);
  
  if (tickers.length === 0) return [];
  
  // Get time points based on range
  const prices = getAssetPrices(tickers[0], range);
  
  return prices.map(pricePoint => {
    const portfolioAtTime = getPortfolioAtTime(pricePoint.t);
    
    const totalValue = Object.entries(portfolioAtTime).reduce((total, [ticker, quantity]) => {
      const assetPrices = getAssetPrices(ticker, range);
      const priceAtDate = assetPrices.find(p => 
        Math.abs(new Date(p.t).getTime() - new Date(pricePoint.t).getTime()) < 
        (range === '1D' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000) // 1 hour tolerance for 1D, 1 day for others
      );
      return total + (priceAtDate ? priceAtDate.c * quantity : 0);
    }, 0);
    
    return {
      t: pricePoint.t,
      c: totalValue
    };
  });
};
