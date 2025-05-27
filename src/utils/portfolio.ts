
import { Portfolio, PortfolioAsset, MarketData, Transaction } from '../types';

const PORTFOLIO_KEY = 'portfolio';
const TRANSACTIONS_KEY = 'transactions';

export const getPortfolio = (): Portfolio => {
  const portfolio = localStorage.getItem(PORTFOLIO_KEY);
  return portfolio ? JSON.parse(portfolio) : {};
};

export const savePortfolio = (portfolio: Portfolio): void => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const addAsset = (ticker: string, quantity: number): void => {
  const portfolio = getPortfolio();
  const transactions = getTransactions();
  
  portfolio[ticker] = (portfolio[ticker] || 0) + quantity;
  savePortfolio(portfolio);
  
  const transaction: Transaction = {
    ts: new Date().toISOString(),
    type: 'ADD',
    ticker,
    qty: quantity
  };
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const removeAsset = (ticker: string, quantity?: number): void => {
  const portfolio = getPortfolio();
  const transactions = getTransactions();
  
  if (!portfolio[ticker]) return;
  
  const currentQuantity = portfolio[ticker];
  const removeQuantity = quantity !== undefined ? Math.min(quantity, currentQuantity) : currentQuantity;
  
  portfolio[ticker] = currentQuantity - removeQuantity;
  
  if (portfolio[ticker] <= 0) {
    delete portfolio[ticker];
  }
  
  savePortfolio(portfolio);
  
  const transaction: Transaction = {
    ts: new Date().toISOString(),
    type: 'REMOVE',
    ticker,
    qty: removeQuantity
  };
  transactions.push(transaction);
  saveTransactions(transactions);
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

export const getPortfolioAtTime = (timestamp: string): Portfolio => {
  const transactions = getTransactions().filter(t => t.ts <= timestamp);
  const portfolio: Portfolio = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'ADD') {
      portfolio[transaction.ticker] = (portfolio[transaction.ticker] || 0) + transaction.qty;
    } else {
      portfolio[transaction.ticker] = (portfolio[transaction.ticker] || 0) - transaction.qty;
      if (portfolio[transaction.ticker] <= 0) {
        delete portfolio[transaction.ticker];
      }
    }
  });
  
  return portfolio;
};
