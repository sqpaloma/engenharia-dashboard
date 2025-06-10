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
import { User, LogOut, Settings, Shield, Bell, Calendar } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { user, logout, unreadNotifications } = useAuth();

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "engineer":
        return <Badge variant="default">Engenheiro</Badge>;
      case "consultant":
        return <Badge variant="secondary">Consultor</Badge>;
      default:
        return <Badge variant="outline">Usuário</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/calendario">
          <Calendar className="h-5 w-5" />
        </Link>
      </Button>

      <DropdownMenu>
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
          <DropdownMenuItem asChild>
            <Link
              href="/chat"
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Novas mensagens no chat</span>
              </div>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
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
                {user.department && (
                  <Badge variant="outline" className="text-xs">
                    {user.department}
                  </Badge>
                )}
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
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
