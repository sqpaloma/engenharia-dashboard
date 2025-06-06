"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Users,
  Settings,
  FileText,
  Target,
  Printer,
  ChevronRight,
} from "lucide-react"

interface Section {
  id: string
  title: string
  icon: any
  content: React.ReactNode
}

export default function ManualPage() {
  const [activeSection, setActiveSection] = useState("objetivo")
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const sections: Section[] = [
    {
      id: "objetivo",
      title: "Objetivo do Manual",
      icon: Target,
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            Este manual tem como objetivo padronizar e orientar os procedimentos do Departamento de Consultoria de
            Serviços – Engenharia da Novak Gouveia.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Finalidades:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                Garantir a qualidade e consistência no atendimento aos clientes
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                Padronizar processos operacionais e administrativos
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                Facilitar o treinamento de novos colaboradores
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                Estabelecer diretrizes claras para tomada de decisões
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "organizacao",
      title: "Organização do Departamento",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Estrutura Organizacional</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Bombas e Motores de Pistões</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Responsáveis:</p>
                  <ul className="text-sm">
                    <li>• Paloma</li>
                    <li>• Giovanni</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Bombas e Comandos de Escavadeira</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Responsável:</p>
                  <ul className="text-sm">
                    <li>• Lucas</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Blocos, Válvulas e Orbitrol</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Responsável:</p>
                  <ul className="text-sm">
                    <li>• Marcelo</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Hierarquia e Responsabilidades</h5>
            <ul className="space-y-2 text-sm">
              <li>• Cada engenheiro é responsável por sua área específica de atuação</li>
              <li>• Coordenação geral do departamento</li>
              <li>• Interface com outros departamentos da empresa</li>
              <li>• Supervisão de processos e qualidade</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "atendimento",
      title: "Procedimentos de Atendimento",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Fluxo de Atendimento ao Cliente</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Recepção da Solicitação</h5>
                  <p className="text-gray-700 text-sm">Registro inicial da demanda do cliente no sistema</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Análise Técnica</h5>
                  <p className="text-gray-700 text-sm">Avaliação técnica da solicitação pelo engenheiro responsável</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Elaboração de Proposta</h5>
                  <p className="text-gray-700 text-sm">Desenvolvimento da proposta técnica e comercial</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Follow-up</h5>
                  <p className="text-gray-700 text-sm">Acompanhamento da proposta e negociação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "processos",
      title: "Processos Operacionais",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orçamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Análise técnica da solicitação</p>
                <p>• Levantamento de custos</p>
                <p>• Elaboração da proposta</p>
                <p>• Aprovação interna</p>
                <p>• Envio ao cliente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Acompanhamento de propostas</p>
                <p>• Contato periódico com clientes</p>
                <p>• Negociação de condições</p>
                <p>• Fechamento de contratos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Devolução</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Recebimento de equipamentos</p>
                <p>• Análise de defeitos</p>
                <p>• Relatório técnico</p>
                <p>• Processo de devolução</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auditoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Verificação de processos</p>
                <p>• Controle de qualidade</p>
                <p>• Documentação</p>
                <p>• Ações corretivas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Garantia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Análise de solicitações</p>
                <p>• Verificação de cobertura</p>
                <p>• Autorização de reparos</p>
                <p>• Acompanhamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expedição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Preparação para envio</p>
                <p>• Documentação fiscal</p>
                <p>• Logística de transporte</p>
                <p>• Rastreamento</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "terceiros",
      title: "Processos de Terceiros",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Expedição</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Coordenação de envios</p>
                  <p>• Interface com transportadoras</p>
                  <p>• Documentação de embarque</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Produção</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Planejamento de produção</p>
                  <p>• Acompanhamento de prazos</p>
                  <p>• Controle de qualidade</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Inspeção de produtos</p>
                  <p>• Certificações</p>
                  <p>• Não conformidades</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Compras</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Aquisição de materiais</p>
                  <p>• Negociação com fornecedores</p>
                  <p>• Controle de estoque</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">PCP</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Planejamento de produção</p>
                  <p>• Controle de materiais</p>
                  <p>• Programação de atividades</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>• Faturamento</p>
                  <p>• Cobrança</p>
                  <p>• Controle de recebimentos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sistema",
      title: "Sistema Sankhya",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Consultas e TOPs no Sistema</h4>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="font-semibold mb-3">Principais Consultas:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">• Consulta de Clientes</p>
                  <p className="font-medium">• Consulta de Produtos</p>
                  <p className="font-medium">• Consulta de Orçamentos</p>
                  <p className="font-medium">• Consulta de Pedidos</p>
                </div>
                <div>
                  <p className="font-medium">• Consulta de Estoque</p>
                  <p className="font-medium">• Consulta Financeira</p>
                  <p className="font-medium">• Consulta de Produção</p>
                  <p className="font-medium">• Relatórios Gerenciais</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h5 className="font-semibold text-gray-800 mb-3">Tipos de TOPs (Tela de Operação):</h5>
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  • <strong>TOP Orçamento:</strong> Elaboração e gestão de propostas comerciais
                </p>
                <p>
                  • <strong>TOP Pedido:</strong> Processamento de pedidos de venda
                </p>
                <p>
                  • <strong>TOP Produção:</strong> Controle de ordens de produção
                </p>
                <p>
                  • <strong>TOP Estoque:</strong> Movimentação e controle de materiais
                </p>
                <p>
                  • <strong>TOP Financeiro:</strong> Gestão de contas a receber e pagar
                </p>
                <p>
                  • <strong>TOP Qualidade:</strong> Controle de inspeções e certificações
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "normas",
      title: "Normas e Padrões Técnicos",
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Diretrizes Técnicas</h4>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Padrões de Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Conformidade com normas ISO</p>
                  <p>• Certificações específicas do setor</p>
                  <p>• Procedimentos de teste e validação</p>
                  <p>• Documentação técnica padronizada</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Segurança e Meio Ambiente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Normas de segurança do trabalho</p>
                  <p>• Procedimentos ambientais</p>
                  <p>• Descarte adequado de materiais</p>
                  <p>• Equipamentos de proteção</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">Importante:</p>
                <p className="text-gray-700 text-sm">
                  Todos os procedimentos devem estar em conformidade com as normas técnicas vigentes e regulamentações
                  do setor.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "melhorias",
      title: "Melhorias e Indicadores",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Indicadores de Performance</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">KPIs Operacionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Tempo médio de resposta</p>
                  <p>• Taxa de conversão de orçamentos</p>
                  <p>• Índice de satisfação do cliente</p>
                  <p>• Produtividade por engenheiro</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metas de Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Redução de retrabalho</p>
                  <p>• Melhoria contínua de processos</p>
                  <p>• Capacitação da equipe</p>
                  <p>• Inovação tecnológica</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Programa de Capacitação</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                  Treinamentos técnicos regulares
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                  Atualização em novas tecnologias
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                  Desenvolvimento de competências
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                  Certificações profissionais
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const activeContent = sections.find((section) => section.id === activeSection)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`container mx-auto px-4 py-8 ${isPrinting ? "print:p-0" : ""}`}>
        {/* Header */}
        <div className={`mb-8 ${isPrinting ? "print:mb-4" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-gray-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manual dos Consultores</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Departamento de Consultoria de Serviços – Engenharia Novak Gouveia
                </p>
              </div>
            </div>
            <Button
              onClick={handlePrint}
              variant="outline"
              className={`flex items-center gap-2 ${isPrinting ? "print:hidden" : ""}`}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className={`grid lg:grid-cols-4 gap-4 sm:gap-8 ${isPrinting ? "print:grid-cols-1" : ""}`}>
          {/* Sidebar Navigation */}
          <div className={`lg:col-span-1 ${isPrinting ? "print:hidden" : ""}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Sumário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{section.title}</span>
                      {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {activeContent && <activeContent.icon className="w-6 h-6 text-gray-600" />}
                  <CardTitle className="text-xl sm:text-2xl">{activeContent?.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose max-w-none">{activeContent?.content}</CardContent>
            </Card>
          </div>
        </div>

        {/* Print Content */}
        <div className="hidden print:block">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Manual do Departamento de Consultoria de Serviços</h1>
            <h2 className="text-xl mb-4">Engenharia Novak Gouveia</h2>
            <div className="border-t border-b py-4 my-6">
              <p className="text-lg font-semibold">Objetivo</p>
              <p className="mt-2">
                Este manual tem como objetivo padronizar e orientar os procedimentos do Departamento de Consultoria de
                Serviços – Engenharia da Novak Gouveia, garantindo a qualidade e consistência no atendimento aos
                clientes.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="break-inside-avoid">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">{section.title}</h3>
                <div className="ml-4">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { font-size: 12px; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:mb-4 { margin-bottom: 1rem !important; }
        }
      `}</style>
    </div>
  )
}
