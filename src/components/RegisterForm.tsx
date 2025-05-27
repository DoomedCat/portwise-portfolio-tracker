
import { useState } from 'react';
import { register } from '../utils/auth';
import { toast } from '../hooks/use-toast';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(email, password);
      
      if (result.success) {
        toast({
          title: "Регистрация успешна",
          description: "Теперь вы можете войти в систему"
        });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast({
          title: "Ошибка регистрации",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-foreground mb-2">
          Пароль
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full"
          placeholder="••••••••"
          minLength={6}
          required
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
          Подтвердите пароль
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input w-full"
          placeholder="••••••••"
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default RegisterForm;
