"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wrench, Settings, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      isAuthenticated &&
      (user?.role === "engineer" || user?.role === "consultant")
    ) {
      // Mapear engenheiros e consultores para seus departamentos
      const engenheiroDepartamento: Record<string, string> = {
        paloma: "bombas-pistoes",
        giovanni: "bombas-pistoes",
        lucas: "bombas-escavadeira",
        marcelo: "blocos-valvulas",
        consultor1: "bombas-pistoes",
        consultor2: "bombas-escavadeira",
      };

      const departamento =
        user.department || engenheiroDepartamento[user.username];
      if (departamento) {
        router.push(`/dashboard?setor=${departamento}`);
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Se for engenheiro ou consultor, mostrar uma mensagem de carregamento enquanto redireciona
  if (user?.role === "engineer" || user?.role === "consultant") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            Redirecionando para seu departamento...
          </p>
        </div>
      </div>
    );
  }

  // Para administradores e outros usuários, mostrar a página normal
  const departamentos = [
    {
      id: "bombas-pistoes",
      nome: "Bombas e motores de pistões e engrenagem",
      responsaveis: ["Paloma", "Giovanni"],
      icon: Wrench,
      color: "bg-blue-500",
    },
    {
      id: "bombas-escavadeira",
      nome: "Bombas, motores e comandos de escavadeira",
      responsaveis: ["Lucas"],
      icon: Settings,
      color: "bg-green-500",
    },
    {
      id: "blocos-valvulas",
      nome: "Blocos, válvulas, orbitrol e pedal de freio",
      responsaveis: ["Marcelo"],
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">
                Bem-vindo ao Sistema de Engenharia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-xl font-semibold mb-2">
                    Sistema de Gestão de Equipamentos
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Gerencie seus equipamentos, análises e movimentações de
                    forma eficiente
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Dashboard</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Visualize métricas e acompanhe o status dos equipamentos
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/dashboard">Acessar Dashboard</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Equipamentos</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Gerencie seus equipamentos e movimentações
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/equipamentos">Ver Equipamentos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}
