import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  Wrench,
  Home,
  Users,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Bell,
} from "lucide-react";

const DEPARTAMENTOS = {
  "bombas-pistoes": {
    nome: "Bombas e motores de pistões e engrenagem",
    responsaveis: ["Paloma", "Giovanni"],
  },
  "bombas-escavadeira": {
    nome: "Bombas, motores e comandos de escavadeira",
    responsaveis: ["Lucas"],
  },
  "blocos-valvulas": {
    nome: "Blocos, válvulas, orbitrol e pedal de freio",
    responsaveis: ["Marcelo"],
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSetor = searchParams.get("setor");

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">Engenharia</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === "/" && "bg-gray-100 text-gray-900"
            )}
          >
            <Home className="h-4 w-4" />
            Início
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === "/dashboard" && "bg-gray-100 text-gray-900"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/equipamentos"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === "/equipamentos" && "bg-gray-100 text-gray-900"
            )}
          >
            <Wrench className="h-4 w-4" />
            Equipamentos
          </Link>
          <Link
            href="/chat"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === "/chat" && "bg-gray-100 text-gray-900"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Link>
          <Link
            href="/calendario"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === "/calendario" && "bg-gray-100 text-gray-900"
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendário
          </Link>
        </nav>
        <div className="mt-4 px-3">
          <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Setores
          </h3>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-gray-900 bg-gray-100 text-gray-900"
            >
              <Package className="h-4 w-4" />
              Todos os Setores
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            pathname === "/configuracoes" && "bg-gray-100 text-gray-900"
          )}
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Link>
      </div>
    </div>
  );
}
