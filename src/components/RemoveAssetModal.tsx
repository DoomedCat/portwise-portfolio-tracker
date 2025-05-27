
import { useState } from 'react';
import { X } from 'lucide-react';
import { removeAsset } from '../utils/portfolio';
import { toast } from '../hooks/use-toast';
import { usePortfolio } from '../contexts/PortfolioContext';

interface RemoveAssetModalProps {
  ticker: string;
  currentQuantity: number;
  onClose: () => void;
}

const RemoveAssetModal = ({ ticker, currentQuantity, onClose }: RemoveAssetModalProps) => {
  const [quantity, setQuantity] = useState(currentQuantity.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = usePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantityNum = parseFloat(quantity);
    if (quantityNum <= 0 || quantityNum > currentQuantity) {
      toast({
        title: "Ошибка",
        description: `Количество должно быть от 0.01 до ${currentQuantity}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      removeAsset(ticker, quantityNum);
      toast({
        title: "Актив удален",
        description: `${quantityNum} ${ticker} удалено из портфеля`
      });
      triggerRefresh();
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить актив",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAll = () => {
    setQuantity(currentQuantity.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Удалить {ticker}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-muted-foreground">
            Текущее количество: <span className="text-foreground font-medium">{currentQuantity}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
              Количество для удаления
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              max={currentQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input w-full"
              placeholder="Введите количество"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleRemoveAll}
            className="w-full btn-secondary text-sm"
          >
            Удалить все ({currentQuantity})
          </button>

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
              {isLoading ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveAssetModal;
