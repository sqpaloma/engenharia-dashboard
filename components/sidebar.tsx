"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Package,
  Home,
  Settings,
  MessageSquare,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  Book,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 z-50 bg-white border rounded-full shadow-md hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <div
        className={cn(
          "flex h-screen flex-col border-r bg-white transition-all duration-300",
          isExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 font-semibold",
              !isExpanded && "justify-center"
            )}
          >
            {isExpanded && <span className="text-lg">Consultoria</span>}
          </Link>
          {isExpanded && (
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === "/" && "bg-gray-100 text-gray-900",
                !isExpanded && "justify-center"
              )}
            >
              <Home className="h-4 w-4" />
              {isExpanded && "Dashboard"}
            </Link>

            <Link
              href="/chat"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === "/chat" && "bg-gray-100 text-gray-900",
                !isExpanded && "justify-center"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              {isExpanded && "Chat"}
            </Link>
            <Link
              href="/calendario"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === "/calendario" && "bg-gray-100 text-gray-900",
                !isExpanded && "justify-center"
              )}
            >
              <Calendar className="h-4 w-4" />
              {isExpanded && "Calendário"}
            </Link>
            <Link
              href="/manual"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === "/manual" && "bg-gray-100 text-gray-900",
                !isExpanded && "justify-center"
              )}
            >
              <Book className="h-4 w-4" />
              {isExpanded && "Manual"}
            </Link>
          </nav>
          {isExpanded && (
            <div className="mt-4 px-3">
              <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Setores
              </h3>
              <div className="space-y-1">
                <Link
                  href="/upload"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-gray-900 text-gray-900"
                >
                  <Package className="h-4 w-4" />
                  Upload de Dados
                </Link>
                <Link
                  href="/administrativo/consultores"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-gray-900",
                    pathname === "/administrativo/consultores" &&
                      "bg-gray-100 text-gray-900"
                  )}
                >
                  <Users className="h-4 w-4" />
                  Consultores
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-2">
            <Link
              href="/configuracoes"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 flex-1",
                pathname === "/configuracoes" && "bg-gray-100 text-gray-900",
                !isExpanded && "justify-center"
              )}
            >
              <Settings className="h-4 w-4" />
              {isExpanded && "Configurações"}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className={cn(
                "text-gray-500 hover:text-gray-900",
                !isExpanded && "w-full"
              )}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
