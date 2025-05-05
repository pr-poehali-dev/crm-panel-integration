
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  ShoppingCart, 
  BarChart4, 
  Settings, 
  Bell, 
  Search,
  Menu,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

const AdminDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Боковое меню для десктопа */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">CRM Система</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink icon={<Home size={20} />} href="/" label="Главная" />
          <SidebarLink icon={<Users size={20} />} href="/users" label="Пользователи" />
          <SidebarLink icon={<ShoppingCart size={20} />} href="/orders" label="Заказы" />
          <SidebarLink icon={<BarChart4 size={20} />} href="/reports" label="Отчеты" />
          <SidebarLink icon={<Settings size={20} />} href="/settings" label="Настройки" />
        </nav>
      </aside>

      {/* Мобильное меню */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">CRM Система</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <SidebarLink icon={<Home size={20} />} href="/" label="Главная" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink icon={<Users size={20} />} href="/users" label="Пользователи" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink icon={<ShoppingCart size={20} />} href="/orders" label="Заказы" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink icon={<BarChart4 size={20} />} href="/reports" label="Отчеты" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink icon={<Settings size={20} />} href="/settings" label="Настройки" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Шапка */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu />
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-8" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Контент панели */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
            
            {/* Карточки со статистикой */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Пользователи" value="1,234" change="+12%" />
              <StatCard title="Заказы" value="845" change="+5%" />
              <StatCard title="Выручка" value="124,500 ₽" change="+18%" />
              <StatCard title="Конверсия" value="32%" change="-2%" negative />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Последние пользователи */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Последние пользователи</h2>
                <div className="space-y-4">
                  <UserListItem 
                    name="Иван Петров" 
                    email="ivan@example.com" 
                    role="Администратор"
                    imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  />
                  <Separator />
                  <UserListItem 
                    name="Мария Иванова" 
                    email="maria@example.com" 
                    role="Менеджер"
                    imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  />
                  <Separator />
                  <UserListItem 
                    name="Алексей Смирнов" 
                    email="alex@example.com" 
                    role="Клиент"
                    imageUrl="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">Посмотреть всех пользователей</Button>
                </div>
              </div>

              {/* Последние заказы */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Последние заказы</h2>
                <div className="space-y-4">
                  <OrderListItem 
                    orderNumber="ORD-12345"
                    customer="Иван Петров"
                    amount="12,500 ₽"
                    status="Выполнен"
                    statusColor="bg-green-100 text-green-800"
                  />
                  <Separator />
                  <OrderListItem 
                    orderNumber="ORD-12344"
                    customer="Мария Иванова"
                    amount="8,900 ₽"
                    status="В обработке"
                    statusColor="bg-blue-100 text-blue-800"
                  />
                  <Separator />
                  <OrderListItem 
                    orderNumber="ORD-12343"
                    customer="Алексей Смирнов"
                    amount="24,300 ₽"
                    status="Отменён"
                    statusColor="bg-red-100 text-red-800"
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">Посмотреть все заказы</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Компоненты
const SidebarLink = ({ icon, href, label, onClick }) => (
  <Link
    to={href}
    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const StatCard = ({ title, value, change, negative = false }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <p className={`text-sm mt-2 ${negative ? 'text-red-600' : 'text-green-600'}`}>
      {change}
    </p>
  </div>
);

const UserListItem = ({ name, email, role, imageUrl }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
    <span className="text-sm text-gray-500">{role}</span>
  </div>
);

const OrderListItem = ({ orderNumber, customer, amount, status, statusColor }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{orderNumber}</p>
      <p className="text-sm text-gray-500">{customer}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{amount}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);

export default AdminDashboard;
