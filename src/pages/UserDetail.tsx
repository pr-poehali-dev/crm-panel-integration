
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Save, Trash2, User as UserIcon } from "lucide-react";
import { User, userService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MainLayout from "@/components/layouts/MainLayout";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Форма редактирования
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await userService.getById(id);
        
        if (response.success && response.data) {
          setUser(response.data);
          
          // Заполнение полей формы
          setName(response.data.name || "");
          setEmail(response.data.email || "");
          setRole(response.data.role || "user");
          setStatus(response.data.status || "active");
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные пользователя",
            variant: "destructive",
          });
          navigate("/users");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при загрузке данных",
          variant: "destructive",
        });
        navigate("/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, toast]);

  // Обработчик сохранения изменений
  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        name,
        email,
        role,
        status,
      };
      
      const response = await userService.update(id, updateData);
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        
        toast({
          title: "Успешно",
          description: "Данные пользователя обновлены",
        });
      } else {
        toast({
          title: "Ошибка",
          description: response.message || "Не удалось обновить данные пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении данных",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Обработчик удаления пользователя
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const response = await userService.delete(id);
      
      if (response.success) {
        toast({
          title: "Успешно",
          description: "Пользователь удален",
        });
        navigate("/users");
      } else {
        toast({
          title: "Ошибка",
          description: response.message || "Не удалось удалить пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении пользователя",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Вывод состояния загрузки
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Пользователь не найден</h2>
            <p className="text-muted-foreground mb-4">
              Пользователь с указанным идентификатором не существует или был удален.
            </p>
            <Button asChild>
              <Link to="/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к списку пользователей
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Профиль пользователя</h1>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Информация о пользователе */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
              <CardDescription>
                Основные данные и настройки учетной записи
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                />
                <AvatarFallback className="text-xl">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Имя пользователя"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Роль</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="manager">Менеджер</SelectItem>
                        <SelectItem value="user">Пользователь</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активен</SelectItem>
                        <SelectItem value="inactive">Неактивен</SelectItem>
                        <SelectItem value="suspended">Заблокирован</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <h3 className="text-xl font-semibold text-center">{user.name}</h3>
                  <p className="text-muted-foreground text-center">{user.email}</p>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Роль</p>
                      <p className="font-medium">
                        {user.role === "admin" ? "Администратор" :
                         user.role === "manager" ? "Менеджер" :
                         user.role === "user" ? "Пользователь" : user.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Статус</p>
                      <p className="font-medium">
                        {user.status === "active" ? "Активен" :
                         user.status === "inactive" ? "Неактивен" :
                         user.status === "suspended" ? "Заблокирован" : user.status || "Активен"}
                      </p>
                    </div>
                    {user.createdAt && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Дата регистрации</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Дополнительная информация и вкладки */}
          <div className="md:col-span-2">
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="activity">Активность</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Заказы пользователя</CardTitle>
                    <CardDescription>
                      История заказов и транзакций пользователя
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>У пользователя пока нет заказов</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Журнал активности</CardTitle>
                    <CardDescription>
                      История действий и входов пользователя
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>История активности пользователя будет отображаться здесь</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Пользователь будет полностью удален из системы вместе со всеми его данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default UserDetailPage;
