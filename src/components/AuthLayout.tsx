
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthLayout = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Portfolio Tracker
          </h1>
          <p className="text-muted-foreground">
            Управляйте своими инвестициями
          </p>
        </div>

        <div className="card">
          <div className="flex mb-6 bg-secondary rounded-xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Регистрация
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
