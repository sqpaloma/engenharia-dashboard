"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { ArrowLeft, Book, HelpCircle } from "lucide-react";
import { Suspense } from "react";

function ManualContent() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button asChild variant="ghost" className="mb-4">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Manual do Sistema
              </h1>
              <p className="text-slate-600">
                Guia completo de utilização do sistema de gestão de equipamentos
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-600" />
                    <CardTitle>Introdução</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Bem-vindo ao manual do sistema de gestão de equipamentos.
                    Este guia irá ajudá-lo a utilizar todas as funcionalidades
                    disponíveis de forma eficiente.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                    <CardTitle>Suporte</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Em caso de dúvidas ou problemas, entre em contato com a
                    equipe de suporte através do e-mail: suporte@empresa.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManualPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ManualContent />
    </Suspense>
  );
}
