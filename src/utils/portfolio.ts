
import { Portfolio, PortfolioAsset, MarketData } from '../types';

const PORTFOLIO_KEY = 'portfolio';

export const getPortfolio = (): Portfolio => {
  const portfolio = localStorage.getItem(PORTFOLIO_KEY);
  return portfolio ? JSON.parse(portfolio) : {};
};

export const savePortfolio = (portfolio: Portfolio): void => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

export const addAsset = (ticker: string, quantity: number): void => {
  const portfolio = getPortfolio();
  portfolio[ticker] = (portfolio[ticker] || 0) + quantity;
  savePortfolio(portfolio);
};

export const removeAsset = (ticker: string): void => {
  const portfolio = getPortfolio();
  delete portfolio[ticker];
  savePortfolio(portfolio);
};

export const getPortfolioAssets = (marketData: MarketData): PortfolioAsset[] => {
  const portfolio = getPortfolio();
  
  return Object.entries(portfolio).map(([ticker, quantity]) => {
    const assetData = marketData[ticker];
    const currentPrice = assetData?.D[assetData.D.length - 1]?.c || 0;
    const totalValue = currentPrice * quantity;
    
    return {
      ticker,
      quantity,
      currentPrice,
      totalValue
    };
  });
};

export const getTotalPortfolioValue = (marketData: MarketData): number => {
  const assets = getPortfolioAssets(marketData);
  return assets.reduce((total, asset) => total + asset.totalValue, 0);
};
