
export interface User {
  email: string;
  passwordHash: string;
}

export interface Portfolio {
  [ticker: string]: number; // ticker -> quantity
}

export interface PriceData {
  t: string; // timestamp
  c: number; // close price
}

export interface AssetPrices {
  D: PriceData[]; // daily
  W: PriceData[]; // weekly  
  M: PriceData[]; // monthly
}

export interface MarketData {
  [ticker: string]: AssetPrices;
}

export interface PortfolioAsset {
  ticker: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
}

export type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'MAX';
