
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  ShoppingCart, 
  BarChart4, 
  Settings, 
  Bell, 
  Search,
  Menu,
  User,
  LogOut,
  Package,
  CreditCard,
  HelpCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Функция для определения, активна ли ссылка
  const isLinkActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Боковое меню для десктопа */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">CRM Система</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink 
            icon={<Home size={20} />} 
            href="/" 
            label="Главная" 
            isActive={isLinkActive('/')}
          />
          <SidebarLink 
            icon={<Users size={20} />} 
            href="/users" 
            label="Пользователи" 
            isActive={isLinkActive('/users')}
          />
          <SidebarLink 
            icon={<Package size={20} />} 
            href="/products" 
            label="Продукты" 
            isActive={isLinkActive('/products')}
          />
          <SidebarLink 
            icon={<ShoppingCart size={20} />} 
            href="/orders" 
            label="Заказы" 
            isActive={isLinkActive('/orders')}
          />
          <SidebarLink 
            icon={<BarChart4 size={20} />} 
            href="/analytics" 
            label="Аналитика" 
            isActive={isLinkActive('/analytics')}
          />
          
          <Separator className="my-3" />
          
          <SidebarLink 
            icon={<CreditCard size={20} />} 
            href="/payments" 
            label="Платежи" 
            isActive={isLinkActive('/payments')}
          />
          <SidebarLink 
            icon={<Settings size={20} />} 
            href="/settings" 
            label="Настройки" 
            isActive={isLinkActive('/settings')}
          />
          <SidebarLink 
            icon={<HelpCircle size={20} />} 
            href="/help" 
            label="Поддержка" 
            isActive={isLinkActive('/help')}
          />
        </nav>
      </aside>

      {/* Мобильное меню */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">CRM Система</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <SidebarLink 
              icon={<Home size={20} />} 
              href="/" 
              label="Главная" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/')}
            />
            <SidebarLink 
              icon={<Users size={20} />} 
              href="/users" 
              label="Пользователи" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/users')}
            />
            <SidebarLink 
              icon={<Package size={20} />} 
              href="/products" 
              label="Продукты" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/products')}
            />
            <SidebarLink 
              icon={<ShoppingCart size={20} />} 
              href="/orders" 
              label="Заказы" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/orders')}
            />
            <SidebarLink 
              icon={<BarChart4 size={20} />} 
              href="/analytics" 
              label="Аналитика" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/analytics')}
            />
            
            <Separator className="my-3" />
            
            <SidebarLink 
              icon={<CreditCard size={20} />} 
              href="/payments" 
              label="Платежи" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/payments')}
            />
            <SidebarLink 
              icon={<Settings size={20} />} 
              href="/settings" 
              label="Настройки" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/settings')}
            />
            <SidebarLink 
              icon={<HelpCircle size={20} />} 
              href="/help" 
              label="Поддержка" 
              onClick={() => setIsMobileMenuOpen(false)}
              isActive={isLinkActive('/help')}
            />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Шапка */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-8" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{user?.name?.charAt(0) || <User />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex w-full">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex w-full">Настройки</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Контент страницы */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

type SidebarLinkProps = {
  icon: React.ReactNode;
  href: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
};

const SidebarLink = ({ icon, href, label, onClick, isActive }: SidebarLinkProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive
        ? "bg-primary text-primary-foreground" 
        : "text-gray-700 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default MainLayout;
