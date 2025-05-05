
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Типы для контекста аутентификации
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер аутентификации
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // В реальном приложении здесь будет запрос к API
        // для получения информации о пользователе
        // const userData = await authService.checkAuth();
        
        // Для демонстрации используем моковые данные
        const userData = {
          id: '1',
          name: 'Администратор',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth-token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Авторизация пользователя
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь будет запрос к API для авторизации
      // const response = await authService.login(email, password);
      // localStorage.setItem('auth-token', response.token);
      
      // Для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('auth-token', 'demo-token');
      
      // Получаем информацию о пользователе
      // const userData = await authService.checkAuth();
      
      // Для демонстрации используем моковые данные
      const userData = {
        id: '1',
        name: 'Администратор',
        email: email,
        role: 'admin'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: 'Успешно',
        description: 'Вы успешно вошли в систему',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      
      toast({
        title: 'Ошибка авторизации',
        description: 'Неверный email или пароль',
        variant: 'destructive',
      });
      
      localStorage.removeItem('auth-token');
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация пользователя
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь будет запрос к API для регистрации
      // await authService.register({ name, email, password });
      
      // Для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Успешно',
        description: 'Аккаунт успешно создан. Теперь вы можете войти в систему.',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      
      toast({
        title: 'Ошибка регистрации',
        description: 'Не удалось создать аккаунт. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Выход из системы
  const logout = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: 'Выход из системы',
      description: 'Вы успешно вышли из системы',
    });
    
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
