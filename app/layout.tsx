import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "@/lib/data-context";
import { AuthProvider } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Consultoria",
  description: "Sistema de gestão e análise de dados operacionais",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
