"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { User, LogOut, Settings, Shield, Bell } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
  const { user, logout, unreadNotifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "engineer":
        return <Badge variant="default">Engenheiro</Badge>;
      case "user":
        return <Badge variant="secondary">Consultor</Badge>;
      default:
        return <Badge variant="outline">Usuário</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notificação */}
      <DropdownMenu
        open={showNotifications}
        onOpenChange={setShowNotifications}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {unreadNotifications > 0 ? (
            <div className="p-2">
              <p className="text-sm text-muted-foreground">
                Você tem {unreadNotifications} nova
                {unreadNotifications > 1 ? "s" : ""} mensagem
                {unreadNotifications > 1 ? "ns" : ""} não lida
                {unreadNotifications > 1 ? "s" : ""}
              </p>
            </div>
          ) : (
            <div className="p-2">
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação nova
              </p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu do Usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-2">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Área Administrativa</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
