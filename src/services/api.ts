
// Настройки API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/v1';
const API_TIMEOUT = 15000; // 15 секунд таймаут

// Типы для работы с API
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
};

export type PaginatedResponse<T = any> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type QueryParams = Record<string, string | number | boolean | undefined>;

// Хелпер для формирования URL с параметрами
const buildUrl = (endpoint: string, params?: QueryParams): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// Основной метод для выполнения запросов
const apiRequest = async <T = any>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  params?: QueryParams
): Promise<ApiResponse<T>> => {
  const url = buildUrl(endpoint, params);
  
  // Получаем токен авторизации
  const token = localStorage.getItem('auth-token');
  
  // Формируем заголовки
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Опции запроса
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // Для работы с cookies
  };
  
  // Добавляем тело запроса для не-GET методов
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  try {
    // Запрос с таймаутом
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT);
    });
    
    const responsePromise = fetch(url, options);
    const response = await Promise.race([responsePromise, timeoutPromise]) as Response;
    
    // Обработка ошибок HTTP
    if (!response.ok) {
      if (response.status === 401) {
        // Автоматический выход при истечении токена
        localStorage.removeItem('auth-token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return { 
          success: false, 
          error: 'Unauthorized', 
          statusCode: 401,
          message: 'Сессия истекла. Пожалуйста, войдите снова'
        };
      }
      
      // Пытаемся получить детали ошибки из тела ответа
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      return { 
        success: false, 
        error: errorData.error || response.statusText,
        message: errorData.message || 'Произошла ошибка при выполнении запроса',
        statusCode: response.status
      };
    }
    
    // Для ответов без контента
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true };
    }
    
    // Парсим JSON ответ
    const responseData = await response.json();
    return { 
      success: true, 
      data: responseData.data || responseData,
      message: responseData.message
    };
    
  } catch (error) {
    console.error('API Request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      message: 'Не удалось выполнить запрос к серверу' 
    };
  }
};

// Сервис аутентификации
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export const authService = {
  login: (data: LoginData) => 
    apiRequest<{user: User, token: string}>('/auth/login', 'POST', data),
  
  register: (data: RegisterData) => 
    apiRequest<{user: User, token: string}>('/auth/register', 'POST', data),
  
  me: () => 
    apiRequest<User>('/auth/me'),
  
  logout: () => 
    apiRequest('/auth/logout', 'POST'),
  
  refreshToken: () => 
    apiRequest<{token: string}>('/auth/refresh-token', 'POST'),
    
  forgotPassword: (email: string) => 
    apiRequest('/auth/forgot-password', 'POST', { email }),
    
  resetPassword: (token: string, password: string) => 
    apiRequest('/auth/reset-password', 'POST', { token, password })
};

// Сервис для работы с пользователями
export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export const userService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => 
    apiRequest<PaginatedResponse<User>>('/users', 'GET', undefined, params),
  
  getById: (id: string) => 
    apiRequest<User>(`/users/${id}`),
  
  create: (data: UserCreateData) => 
    apiRequest<User>('/users', 'POST', data),
  
  update: (id: string, data: UserUpdateData) => 
    apiRequest<User>(`/users/${id}`, 'PUT', data),
  
  delete: (id: string) => 
    apiRequest(`/users/${id}`, 'DELETE'),
    
  exportUsers: (format: 'csv' | 'excel' = 'csv') => 
    apiRequest(`/users/export?format=${format}`)
};

// Сервис для работы с заказами
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateData {
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}

export interface OrderUpdateData {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export const orderService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; from?: string; to?: string }) => 
    apiRequest<PaginatedResponse<Order>>('/orders', 'GET', undefined, params),
  
  getById: (id: string) => 
    apiRequest<Order>(`/orders/${id}`),
  
  create: (data: OrderCreateData) => 
    apiRequest<Order>('/orders', 'POST', data),
  
  update: (id: string, data: OrderUpdateData) => 
    apiRequest<Order>(`/orders/${id}`, 'PUT', data),
  
  delete: (id: string) => 
    apiRequest(`/orders/${id}`, 'DELETE'),
    
  getOrdersByUser: (userId: string, params?: { page?: number; limit?: number }) => 
    apiRequest<PaginatedResponse<Order>>(`/users/${userId}/orders`, 'GET', undefined, params),
    
  exportOrders: (format: 'csv' | 'excel' = 'csv', params?: { from?: string; to?: string; status?: string }) => 
    apiRequest(`/orders/export?format=${format}`, 'GET', undefined, params)
};

// Сервис для работы с продуктами
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
}

export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
}

export const productService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; minPrice?: number; maxPrice?: number }) => 
    apiRequest<PaginatedResponse<Product>>('/products', 'GET', undefined, params),
  
  getById: (id: string) => 
    apiRequest<Product>(`/products/${id}`),
  
  create: (data: ProductCreateData) => 
    apiRequest<Product>('/products', 'POST', data),
  
  update: (id: string, data: ProductUpdateData) => 
    apiRequest<Product>(`/products/${id}`, 'PUT', data),
  
  delete: (id: string) => 
    apiRequest(`/products/${id}`, 'DELETE'),
    
  getCategories: () => 
    apiRequest<string[]>('/products/categories')
};

// Сервис для работы с аналитикой и отчетами
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrders: Order[];
  topProducts: (Product & { soldCount: number })[];
  userGrowth: { date: string; count: number }[];
  revenueTrend: { date: string; revenue: number }[];
}

export const analyticsService = {
  getDashboardStats: () => 
    apiRequest<DashboardStats>('/analytics/dashboard'),
    
  getUserStats: (params?: { from?: string; to?: string }) => 
    apiRequest('/analytics/users', 'GET', undefined, params),
    
  getOrderStats: (params?: { from?: string; to?: string }) => 
    apiRequest('/analytics/orders', 'GET', undefined, params),
    
  getRevenueStats: (params?: { from?: string; to?: string; groupBy?: 'day' | 'week' | 'month' }) => 
    apiRequest('/analytics/revenue', 'GET', undefined, params)
};

// Экспортируем единый интерфейс API
const api = {
  auth: authService,
  users: userService,
  orders: orderService,
  products: productService,
  analytics: analyticsService
};

export default api;
