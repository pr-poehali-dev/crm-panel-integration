
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  ShoppingCart,
  Package,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layouts/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { analyticsService, userService, orderService } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    recentUsers: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // В реальном приложении здесь будет запрос к API для получения данных дашборда
        // const response = await analyticsService.getDashboardStats();
        
        // Для демонстрации используем моковые данные
        const mockStats = {
          totalUsers: 1234,
          totalOrders: 845,
          totalRevenue: 124500,
          conversionRate: 32,
        };
        
        // Получаем последних пользователей
        const usersResponse = await userService.getAll({ limit: 3 });
        const recentUsers = usersResponse.success ? usersResponse.data?.items || [] : [];
        
        // Получаем последние заказы
        const ordersResponse = await orderService.getAll({ limit: 3 });
        const recentOrders = ordersResponse.success ? ordersResponse.data?.items || [] : [];
        
        setStats({
          ...mockStats,
          recentUsers,
          recentOrders
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные дашборда",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Моковые данные, если API не вернул результаты
  const mockUsers = [
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan@example.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      id: "2",
      name: "Мария Иванова",
      email: "maria@example.com",
      role: "manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      id: "3",
      name: "Алексей Смирнов",
      email: "alex@example.com",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  const mockOrders = [
    {
      id: "ORD-12345",
      customerName: "Иван Петров",
      total: 12500,
      status: "completed"
    },
    {
      id: "ORD-12344",
      customerName: "Мария Иванова",
      total: 8900,
      status: "processing"
    },
    {
      id: "ORD-12343",
      customerName: "Алексей Смирнов",
      total: 24300,
      status: "cancelled"
    }
  ];

  // Используем данные API или моковые, если API не вернул результаты
  const users = stats.recentUsers.length > 0 ? stats.recentUsers : mockUsers;
  const orders = stats.recentOrders.length > 0 ? stats.recentOrders : mockOrders;

  // Форматирование валюты
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Статус заказа
  const getOrderStatus = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: "Выполнен",
          color: "bg-green-100 text-green-800"
        };
      case 'processing':
        return {
          label: "В обработке",
          color: "bg-blue-100 text-blue-800"
        };
      case 'cancelled':
        return {
          label: "Отменён",
          color: "bg-red-100 text-red-800"
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800"
        };
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Панель управления</h1>
          <Button variant="outline">
            Экспорт данных
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Карточки со статистикой */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Пользователи" 
                value={stats.totalUsers} 
                change="+12%" 
                icon={<Users className="h-5 w-5" />}
              />
              <StatCard 
                title="Заказы" 
                value={stats.totalOrders} 
                change="+5%" 
                icon={<ShoppingCart className="h-5 w-5" />}
              />
              <StatCard 
                title="Выручка" 
                value={formatCurrency(stats.totalRevenue)} 
                change="+18%" 
                icon={<DollarSign className="h-5 w-5" />}
              />
              <StatCard 
                title="Конверсия" 
                value={`${stats.conversionRate}%`} 
                change="-2%" 
                negative 
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Последние пользователи */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Последние пользователи</CardTitle>
                    <CardDescription>
                      Недавно зарегистрированные пользователи
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/users">
                      Все пользователи
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id}>
                        <UserListItem 
                          id={user.id}
                          name={user.name} 
                          email={user.email} 
                          role={user.role}
                          imageUrl={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                        />
                        <Separator className="mt-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Последние заказы */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Последние заказы</CardTitle>
                    <CardDescription>
                      Недавно созданные заказы
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">
                      Все заказы
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const status = getOrderStatus(order.status);
                      return (
                        <div key={order.id}>
                          <OrderListItem 
                            id={order.id}
                            orderNumber={order.id}
                            customer={order.customerName}
                            amount={formatCurrency(order.total)}
                            status={status.label}
                            statusColor={status.color}
                          />
                          <Separator className="mt-4" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

// Компоненты
const StatCard = ({ title, value, change, negative = false, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <div className={`text-sm mt-2 flex items-center ${negative ? 'text-red-600' : 'text-green-600'}`}>
        {negative ? (
          <ArrowDownRight className="mr-1 h-4 w-4" />
        ) : (
          <ArrowUpRight className="mr-1 h-4 w-4" />
        )}
        {change}
      </div>
    </CardContent>
  </Card>
);

const UserListItem = ({ id, name, email, role, imageUrl }) => (
  <Link to={`/users/${id}`} className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium group-hover:text-primary transition-colors">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
    <span className="text-sm text-muted-foreground">
      {role === "admin" ? "Администратор" :
       role === "manager" ? "Менеджер" :
       role === "user" ? "Пользователь" : role}
    </span>
  </Link>
);

const OrderListItem = ({ id, orderNumber, customer, amount, status, statusColor }) => (
  <Link to={`/orders/${id}`} className="flex items-center justify-between group">
    <div>
      <p className="font-medium group-hover:text-primary transition-colors">{orderNumber}</p>
      <p className="text-sm text-muted-foreground">{customer}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{amount}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  </Link>
);

export default Dashboard;
