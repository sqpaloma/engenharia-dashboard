"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  BookOpen,
  Shield,
  Menu,
  Home,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "./user-menu";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, unreadNotifications } = useAuth();

  const navItems = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      description: "Página inicial",
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageCircle,
      description: "Chat da equipe",
      requiresAuth: true,
    },
    {
      href: "/admin",
      label: "Área Administrativa",
      icon: Shield,
      description: "Gestão completa dos dados",
      requiresAuth: true,
      adminOnly: true,
    },
    {
      href: "/manual",
      label: "Manual dos Consultores",
      icon: BookOpen,
      description: "Guia de utilização",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.adminOnly && user?.role !== "admin") return false;
    if (
      user?.role === "consultant" &&
      (item.href === "/admin" || item.href === "/manual")
    )
      return false;
    return true;
  });

  const getDepartmentNav = () => {
    if (!user || user.role !== "consultant") return null;

    return {
      href: `/dashboard?setor=${user.department}`,
      label: "Meu Departamento",
      icon: BarChart3,
      description: "Dashboard do departamento",
    };
  };

  const departmentNav = getDepartmentNav();
  if (departmentNav) {
    filteredNavItems.push(departmentNav);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800">Consultoria</h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "default" : "ghost"}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.href === "/chat" && unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* User Menu */}
            {user && <UserMenu />}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800">
                          Consultoria
                        </h2>
                        <p className="text-sm text-slate-500">
                          Sistema de Gestão
                        </p>
                      </div>
                    </div>

                    {filteredNavItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            active
                              ? "bg-blue-100 text-blue-700"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.label}</span>
                              {item.href === "/chat" &&
                                unreadNotifications > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {unreadNotifications}
                                  </Badge>
                                )}
                            </div>
                            <p className="text-sm text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
