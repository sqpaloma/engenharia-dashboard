import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "@/lib/data-context";
import { AuthProvider } from "@/lib/auth-context";
import { ConditionalLayout } from "@/components/conditional-layout";

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
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
