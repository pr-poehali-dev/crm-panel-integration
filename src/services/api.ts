
const API_URL = 'https://api.example.com'; // Замените на URL вашего API

// Функция для выполнения fetch-запросов с обработкой ошибок
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Получаем токен из localStorage
  const token = localStorage.getItem('auth-token');
  
  // Устанавливаем заголовки по умолчанию
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Если ответ не 2xx, выкидываем ошибку
    if (!response.ok) {
      // Проверяем на ошибку авторизации
      if (response.status === 401) {
        // Удаляем токен, если он устарел или невалиден
        localStorage.removeItem('auth-token');
        // Если мы не на странице логина, перенаправляем на неё
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
    }
    
    // Если ответ пустой или не содержит JSON
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Сервис для аутентификации
export const authService = {
  // Авторизация пользователя
  login: async (email: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Регистрация нового пользователя
  register: async (userData: { name: string, email: string, password: string }) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Выход из системы
  logout: () => {
    localStorage.removeItem('auth-token');
  },
  
  // Проверка авторизации
  checkAuth: async () => {
    return fetchApi('/auth/me');
  },
};

// Сервис для работы с пользователями
export const userService = {
  // Получение списка пользователей
  getUsers: async (page = 1, limit = 10) => {
    return fetchApi(`/users?page=${page}&limit=${limit}`);
  },
  
  // Получение конкретного пользователя
  getUser: async (id: string) => {
    return fetchApi(`/users/${id}`);
  },
  
  // Создание пользователя
  createUser: async (userData: any) => {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Обновление пользователя
  updateUser: async (id: string, userData: any) => {
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // Удаление пользователя
  deleteUser: async (id: string) => {
    return fetchApi(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Сервис для работы с заказами
export const orderService = {
  // Получение списка заказов
  getOrders: async (page = 1, limit = 10) => {
    return fetchApi(`/orders?page=${page}&limit=${limit}`);
  },
  
  // Получение конкретного заказа
  getOrder: async (id: string) => {
    return fetchApi(`/orders/${id}`);
  },
  
  // Создание заказа
  createOrder: async (orderData: any) => {
    return fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  // Обновление заказа
  updateOrder: async (id: string, orderData: any) => {
    return fetchApi(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },
  
  // Удаление заказа
  deleteOrder: async (id: string) => {
    return fetchApi(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Экспортируем интерфейс API
export default {
  auth: authService,
  users: userService,
  orders: orderService,
};
