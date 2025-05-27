
import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { PortfolioAsset } from '../types';
import { toast } from '../hooks/use-toast';
import { usePortfolio } from '../contexts/PortfolioContext';
import AddAssetModal from './AddAssetModal';
import RemoveAssetModal from './RemoveAssetModal';

interface PortfolioSectionProps {
  assets: PortfolioAsset[];
  totalValue: number;
  onAssetClick: (ticker: string) => void;
}

const PortfolioSection = ({ assets, totalValue, onAssetClick }: PortfolioSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeAsset, setRemoveAsset] = useState<{ticker: string, quantity: number} | null>(null);

  const handleRemoveAsset = (ticker: string, quantity: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoveAsset({ ticker, quantity });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Портфель</h2>
          <p className="text-3xl font-bold text-accent mt-2">
            {formatCurrency(totalValue)}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить актив</span>
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Портфель пуст
          </h3>
          <p className="text-muted-foreground mb-4">
            Добавьте первый актив, чтобы начать отслеживание
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Добавить актив
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-4">
              <div>Тикер</div>
              <div>Количество</div>
              <div>Цена</div>
              <div>Стоимость</div>
              <div></div>
            </div>
            <div className="space-y-2">
              {assets.map((asset) => (
                <div
                  key={asset.ticker}
                  onClick={() => onAssetClick(asset.ticker)}
                  className="grid grid-cols-5 gap-4 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-foreground">{asset.ticker}</div>
                  <div className="text-muted-foreground">{asset.quantity}</div>
                  <div className="text-muted-foreground">{formatCurrency(asset.currentPrice)}</div>
                  <div className="text-foreground font-medium">{formatCurrency(asset.totalValue)}</div>
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleRemoveAsset(asset.ticker, asset.quantity, e)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.ticker}
                onClick={() => onAssetClick(asset.ticker)}
                className="bg-secondary rounded-lg p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground text-lg">{asset.ticker}</h3>
                  <button
                    onClick={(e) => handleRemoveAsset(asset.ticker, asset.quantity, e)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Количество:</span>
                    <span className="ml-2 text-foreground">{asset.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Цена:</span>
                    <span className="ml-2 text-foreground">{formatCurrency(asset.currentPrice)}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-border/20">
                  <span className="text-muted-foreground text-sm">Общая стоимость:</span>
                  <span className="ml-2 text-accent font-medium">{formatCurrency(asset.totalValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddAssetModal
          onClose={() => setShowAddModal(false)}
        />
      )}

      {removeAsset && (
        <RemoveAssetModal
          ticker={removeAsset.ticker}
          currentQuantity={removeAsset.quantity}
          onClose={() => setRemoveAsset(null)}
        />
      )}
    </div>
  );
};

export default PortfolioSection;
