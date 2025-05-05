
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/use-auth";

// Страницы
import Dashboard from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import UsersPage from "./pages/Users";
import UserDetailPage from "./pages/UserDetail";
import UserCreatePage from "./pages/UserCreate";

const queryClient = new QueryClient();

// Компонент защищенного маршрута
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Компонент для публичных маршрутов (только для неаутентифицированных пользователей)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Оборачиваем Routes в AuthProvider
const AppRoutes = () => (
  <Routes>
    {/* Публичные маршруты */}
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/register" 
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } 
    />
    
    {/* Защищенные маршруты */}
    <Route path="/" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    
    {/* Маршруты для пользователей */}
    <Route path="/users" element={
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    } />
    <Route path="/users/create" element={
      <ProtectedRoute>
        <UserCreatePage />
      </ProtectedRoute>
    } />
    <Route path="/users/:id" element={
      <ProtectedRoute>
        <UserDetailPage />
      </ProtectedRoute>
    } />
    <Route path="/users/:id/edit" element={
      <ProtectedRoute>
        <UserDetailPage />
      </ProtectedRoute>
    } />
    
    {/* Любой другой маршрут (404) */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
