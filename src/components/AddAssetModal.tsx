
import { useState } from 'react';
import { X } from 'lucide-react';
import { addAsset } from '../utils/portfolio';
import { getMarketData } from '../utils/marketData';
import { toast } from '../hooks/use-toast';

interface AddAssetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddAssetModal = ({ onClose, onSuccess }: AddAssetModalProps) => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableTickers = Object.keys(getMarketData());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker || !quantity) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (quantityNum <= 0) {
      toast({
        title: "Ошибка",
        description: "Количество должно быть больше нуля",
        variant: "destructive"
      });
      return;
    }

    if (!availableTickers.includes(ticker.toUpperCase())) {
      toast({
        title: "Ошибка",
        description: `Тикер ${ticker.toUpperCase()} не найден`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      addAsset(ticker.toUpperCase(), quantityNum);
      toast({
        title: "Актив добавлен",
        description: `${ticker.toUpperCase()} успешно добавлен в портфель`
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить актив",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Добавить актив</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-foreground mb-2">
              Тикер
            </label>
            <input
              id="ticker"
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="input w-full"
              placeholder="AAPL"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Доступные: {availableTickers.join(', ')}
            </p>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
              Количество
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input w-full"
              placeholder="10"
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
