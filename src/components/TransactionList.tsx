
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getTransactions } from '../utils/portfolio';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Transaction } from '../types';

const TransactionList = () => {
  const { refreshKey } = usePortfolio();
  const transactions = getTransactions();

  // Sort transactions by timestamp, newest first
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.ts).getTime() - new Date(a.ts).getTime()
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    if (type === 'ADD') {
      return <ArrowUpRight className="w-5 h-5 text-green-500" />;
    }
    return <ArrowDownLeft className="w-5 h-5 text-red-500" />;
  };

  const getTransactionType = (type: Transaction['type']) => {
    return type === 'ADD' ? 'Покупка' : 'Продажа';
  };

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-foreground mb-6">История операций</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Операции не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-foreground mb-6">История операций</h2>
      
      <div className="max-h-72 overflow-y-auto space-y-2">
        {sortedTransactions.map((transaction, index) => (
          <div
            key={`${transaction.ts}-${transaction.ticker}-${index}`}
            className="rounded-xl border border-zinc-700 p-3 flex items-center gap-4 w-full max-w-lg"
          >
            {getTransactionIcon(transaction.type)}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm sm:text-base text-white">
                <span>{formatDate(transaction.ts)}</span>
                <span>•</span>
                <span>{getTransactionType(transaction.type)}</span>
                <span>•</span>
                <span className="font-medium">{transaction.ticker}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Кол-во: {transaction.qty}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
