"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { BarChart3, Package, Wrench, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Header } from "@/components/header"

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
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

type FilterType = "todos" | "followups" | "analises" | "orcamentos" | "execucao" | "devolucoes" | "movimentacoes"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const setor = searchParams.get("setor") as keyof typeof DEPARTAMENTOS
  const { followUpData, devolucaoData, movimentacaoData } = useData()
  const { user } = useAuth()
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todos")
  const router = useRouter()

  const departamento = DEPARTAMENTOS[setor]

  // Verificar se o usuário tem acesso a este departamento
  useEffect(() => {
    if (user?.role === "engineer") {
      const engenheiroDepartamento: Record<string, string> = {
        paloma: "bombas-pistoes",
        giovanni: "bombas-pistoes",
        lucas: "bombas-escavadeira",
        marcelo: "blocos-valvulas",
      }

      const departamentoAutorizado = engenheiroDepartamento[user.username]

      // Se o engenheiro está tentando acessar um departamento não autorizado
      if (departamentoAutorizado && departamentoAutorizado !== setor) {
        router.push(`/dashboard?setor=${departamentoAutorizado}`)
      }
    }
  }, [setor, user, router])

  if (!departamento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Setor não encontrado</h1>
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Filtrar dados para o setor atual
  const followUpsSetor = followUpData.filter((item) => departamento.responsaveis.includes(item.engenheiro))
  const devolucoesSetor = devolucaoData.filter((item) => departamento.responsaveis.includes(item.engenheiro))
  const movimentacoesSetor = movimentacaoData.filter((item) => departamento.responsaveis.includes(item.engenheiro))

  // Calcular métricas
  const totalFollowUps = followUpsSetor.length
  const totalDevolucoes = devolucoesSetor.length
  const totalMovimentacoes = movimentacoesSetor.length
  const totalItens = totalFollowUps + totalDevolucoes + totalMovimentacoes

  // Filtros específicos
  const analises = followUpsSetor.filter(
    (item) => item.tipo.toLowerCase().includes("análise") || item.tipo.toLowerCase().includes("analise"),
  )
  const orcamentos = followUpsSetor.filter(
    (item) => item.tipo.toLowerCase().includes("orçamento") || item.tipo.toLowerCase().includes("orcamento"),
  )
  const execucao = followUpsSetor.filter(
    (item) =>
      item.tipo.toLowerCase().includes("execução") ||
      item.tipo.toLowerCase().includes("execucao") ||
      item.tipo.toLowerCase().includes("em execução"),
  )

  // Função para obter dados filtrados
  const getDadosFiltrados = () => {
    switch (filtroAtivo) {
      case "followups":
        return { followUps: followUpsSetor, devolucoes: [], movimentacoes: [] }
      case "analises":
        return { followUps: analises, devolucoes: [], movimentacoes: [] }
      case "orcamentos":
        return { followUps: orcamentos, devolucoes: [], movimentacoes: [] }
      case "execucao":
        return { followUps: execucao, devolucoes: [], movimentacoes: [] }
      case "devolucoes":
        return { followUps: [], devolucoes: devolucoesSetor, movimentacoes: [] }
      case "movimentacoes":
        return { followUps: [], devolucoes: [], movimentacoes: movimentacoesSetor }
      default:
        return { followUps: followUpsSetor, devolucoes: devolucoesSetor, movimentacoes: movimentacoesSetor }
    }
  }

  const dadosFiltrados = getDadosFiltrados()
  const totalFiltrado =
    dadosFiltrados.followUps.length + dadosFiltrados.devolucoes.length + dadosFiltrados.movimentacoes.length

  // Função para obter o título do filtro
  const getTituloFiltro = () => {
    switch (filtroAtivo) {
      case "followups":
        return "Follow-ups"
      case "analises":
        return "Análises"
      case "orcamentos":
        return "Orçamentos"
      case "execucao":
        return "Em Execução"
      case "devolucoes":
        return "Devoluções"
      case "movimentacoes":
        return "Movimentações"
      default:
        return "Todos os Itens"
    }
  }

  // Dados para gráficos
  const dadosPorResponsavel = departamento.responsaveis.map((resp) => {
    const followUps = followUpsSetor.filter((item) => item.engenheiro === resp)
    const devolucoes = devolucoesSetor.filter((item) => item.engenheiro === resp)
    const movimentacoes = movimentacoesSetor.filter((item) => item.engenheiro === resp)

    return {
      nome: resp,
      followUps: followUps.length,
      devolucoes: devolucoes.length,
      movimentacoes: movimentacoes.length,
      total: followUps.length + devolucoes.length + movimentacoes.length,
    }
  })

  const dadosPorTipo = [
    {
      name: "Follow-ups",
      value: totalFollowUps,
    },
    {
      name: "Devoluções",
      value: totalDevolucoes,
    },
    {
      name: "Movimentações",
      value: totalMovimentacoes,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{departamento.nome}</h1>
          <p className="text-slate-600">Responsáveis: {departamento.responsaveis.join(", ")}</p>
        </div>

        {/* Métricas principais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "todos" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("todos")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Itens</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItens}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "followups" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("followups")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFollowUps}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "analises" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("analises")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Análises</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analises.length}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "orcamentos" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("orcamentos")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orcamentos.length}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "execucao" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("execucao")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{execucao.length}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "devolucoes" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("devolucoes")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devoluções</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDevolucoes}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroAtivo === "movimentacoes" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setFiltroAtivo("movimentacoes")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMovimentacoes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Indicador de filtro ativo */}
        {filtroAtivo !== "todos" && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-blue-100 border border-blue-200 rounded-lg">
              <Badge variant="default" className="flex items-center gap-1">
                {getTituloFiltro()}
                <button onClick={() => setFiltroAtivo("todos")} className="ml-1 hover:bg-blue-700 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <span className="text-sm text-blue-700">
                Mostrando {totalFiltrado} {totalFiltrado === 1 ? "item" : "itens"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltroAtivo("todos")}
                className="ml-auto text-blue-700 hover:text-blue-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Ver todos
              </Button>
            </div>
          </div>
        )}

        {/* Gráficos - só mostrar quando não há filtro específico */}
        {filtroAtivo === "todos" && totalItens > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Itens por Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosPorResponsavel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="followUps" fill="#f59e0b" name="Follow-ups" />
                    <Bar dataKey="devolucoes" fill="#10b981" name="Devoluções" />
                    <Bar dataKey="movimentacoes" fill="#ef4444" name="Movimentações" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de projetos do setor */}
        {totalFiltrado > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{getTituloFiltro()} do Departamento</CardTitle>
              <p className="text-sm text-slate-600">
                {totalFiltrado} {totalFiltrado === 1 ? "item encontrado" : "itens encontrados"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Follow-ups */}
                {dadosFiltrados.followUps.map((item, index) => (
                  <div key={`fu-${index}`} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{item.descricao}</h4>
                        <p className="text-sm text-slate-600">ID: {item.id} | Tipo: Follow-up</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.tipo}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.prioridade === "Alta"
                              ? "bg-red-100 text-red-800"
                              : item.prioridade === "Média"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.prioridade}
                        </span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Cliente:</strong> {item.cliente}
                        </p>
                        <p>
                          <strong>Responsável:</strong> {item.engenheiro}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Prazo:</strong> {item.prazo}
                        </p>
                        {item.observacoes && (
                          <p>
                            <strong>Observações:</strong> {item.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Devoluções */}
                {dadosFiltrados.devolucoes.map((item, index) => (
                  <div key={`dev-${index}`} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{item.equipamento}</h4>
                        <p className="text-sm text-slate-600">ID: {item.id} | Tipo: Devolução</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Cliente:</strong> {item.cliente}
                        </p>
                        <p>
                          <strong>Responsável:</strong> {item.engenheiro}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Data Entrada:</strong> {item.dataEntrada}
                        </p>
                        <p>
                          <strong>Motivo:</strong> {item.motivoDevolucao}
                        </p>
                        {item.observacoes && (
                          <p>
                            <strong>Observações:</strong> {item.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Movimentações */}
                {dadosFiltrados.movimentacoes.map((item, index) => (
                  <div key={`mov-${index}`} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{item.orcamento}</h4>
                        <p className="text-sm text-slate-600">ID: {item.id} | Tipo: Movimentação Interna</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Cliente:</strong> {item.cliente}
                        </p>
                        <p>
                          <strong>Responsável:</strong> {item.engenheiro}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Tipo:</strong> {item.tipoMovimentacao}
                        </p>
                        <p>
                          <strong>Data:</strong> {item.dataMovimentacao}
                        </p>
                        {item.observacoes && (
                          <p>
                            <strong>Observações:</strong> {item.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
