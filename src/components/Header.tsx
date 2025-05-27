
import { LogOut, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Portfolio Tracker</h1>
            <p className="text-sm text-muted-foreground">Управление инвестициями</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
