"use client";

import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/user-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Configurações
            </h1>
            <p className="text-slate-600">
              Gerencie suas preferências e configurações
            </p>
          </div>
          <UserMenu />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-slate-600">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Usuário</p>
                  <p className="text-sm text-slate-600">@{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Departamento</p>
                  <p className="text-sm text-slate-600">
                    {user.department || "Não definido"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Função</p>
                  <p className="text-sm text-slate-600">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                As configurações de notificação estarão disponíveis em breve.
              </p>
            </CardContent>
          </Card>

          {user.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Administração
                </CardTitle>
                <CardDescription>
                  Acesse as configurações administrativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/administrativo">
                    Acessar Área Administrativa
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
