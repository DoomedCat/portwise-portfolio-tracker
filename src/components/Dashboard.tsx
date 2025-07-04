
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import { getMarketData } from '../utils/marketData';
import { getPortfolioAssets, getTotalPortfolioValue } from '../utils/portfolio';
import { MarketData } from '../types';
import { usePortfolio } from '../contexts/PortfolioContext';
import Header from './Header';
import PortfolioSection from './PortfolioSection';
import PortfolioChart from './PortfolioChart';
import AssetModal from './AssetModal';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const { refreshKey } = usePortfolio();

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }
    
    const data = getMarketData();
    setMarketData(data);
  }, [refreshKey]);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  const handleAssetClick = (ticker: string) => {
    setSelectedAsset(ticker);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  const portfolioAssets = getPortfolioAssets(marketData);
  const totalValue = getTotalPortfolioValue(marketData);

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioSection 
            assets={portfolioAssets}
            totalValue={totalValue}
            onAssetClick={handleAssetClick}
          />
          
          <PortfolioChart marketData={marketData} />
        </div>

        <TransactionList />
      </main>

      {selectedAsset && (
        <AssetModal
          ticker={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
