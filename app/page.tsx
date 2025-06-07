"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wrench, Settings } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Bem-vindo, {user?.name}!
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {departamentos.map((dept) => {
            const Icon = dept.icon;
            return (
              <Card
                key={dept.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${dept.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{dept.nome}</CardTitle>
                  <CardDescription className="text-base">
                    Responsáveis:{" "}
                    <span className="font-medium">
                      {dept.responsaveis.join(", ")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/dashboard?setor=${dept.id}`}>
                      Acessar Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
