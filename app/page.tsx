"use client";
import { useState, useMemo, lazy, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/data-context";
import { BarChart3, Package, X, ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MetricsCards } from "./components/dashboard/metrics-cards";
import { Charts } from "./components/dashboard/charts";
import { ItemsList } from "./components/dashboard/items-list";

type DataItem = {
  id?: string;
  nomeParceiro?: string;
  responsavel?: string;
  status?: string;
  data?: string;
  orcamento?: string;
  valor?: number;
  motivo?: string;
  observacoes?: string;
  tipo?: string;
  os?: string;
  descricao?: string;
  engenheiro?: string;
  parceiro?: string;
  dataEntrada?: string;
  motivoDevolucao?: string;
  tipoMovimentacao?: string;
  dataMovimentacao?: string;
};

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

type FilterType =
  | "todos"
  | "followups"
  | "analises"
  | "orcamentos"
  | "execucao"
  | "devolucoes"
  | "movimentacoes";

// Função utilitária para converter datas em vários formatos para Date
function parsePrazo(prazoStr: string | undefined): Date | null {
  if (!prazoStr) return null;
  const parts = prazoStr.includes("/")
    ? prazoStr.split("/")
    : prazoStr.split("-");
  if (parts.length !== 3) return null;
  let [dia, mes, ano] = parts;
  if (ano.length === 2) {
    const anoNum = parseInt(ano, 10);
    ano = anoNum < 50 ? `20${ano}` : `19${ano}`;
  }
  return new Date(
    `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T23:59:59`
  );
}

function getPrazoStats<T>(
  lista: T[],
  campoData: keyof T
): {
  atrasados: number;
  noPrazo: number;
  total: number;
  percAtrasados: number;
  percNoPrazo: number;
} {
  const hoje = new Date();
  let atrasados = 0;
  let noPrazo = 0;
  let total = 0;
  lista.forEach((item) => {
    const prazo = parsePrazo(item[campoData] as string);
    if (prazo) {
      total++;
      if (prazo < hoje) {
        atrasados++;
      } else {
        noPrazo++;
      }
    }
  });
  return {
    atrasados,
    noPrazo,
    total,
    percAtrasados: total ? Math.round((atrasados / total) * 100) : 0,
    percNoPrazo: total ? Math.round((noPrazo / total) * 100) : 0,
  };
}

// Lazy load the administrative tab content
const AdministrativeTab = lazy(() => import("./components/administrative-tab"));

export default function DashboardPage() {
  const { aguardandoAprovacaoData, devolucaoData, movimentacaoData, data } =
    useData();
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todos");
  const [engenheiroFiltro, setEngenheiroFiltro] = useState<string>("todos");

  // Função para obter dados de todos os departamentos
  const getDepartamentoData = () => {
    return {
      nome: "Departamentos da Consultoria",
      responsaveis: Object.values(DEPARTAMENTOS).flatMap(
        (dept) => dept.responsaveis
      ),
    };
  };

  const departamento = getDepartamentoData();

  // Filtrar dados para todos os setores e por engenheiro se selecionado
  const aguardandoAprovacaoSetor = aguardandoAprovacaoData.filter((item) => {
    const matchEngenheiro =
      engenheiroFiltro === "todos" ||
      item.engenheiro.toLowerCase() === engenheiroFiltro.toLowerCase();
    return (
      departamento.responsaveis
        .map((r) => r.toLowerCase())
        .includes(item.engenheiro.toLowerCase()) && matchEngenheiro
    );
  });

  const devolucoesSetor = devolucaoData.filter((item) => {
    const matchEngenheiro =
      engenheiroFiltro === "todos" ||
      item.engenheiro.toLowerCase() === engenheiroFiltro.toLowerCase();
    return (
      departamento.responsaveis
        .map((r) => r.toLowerCase())
        .includes(item.engenheiro.toLowerCase()) && matchEngenheiro
    );
  });

  const movimentacoesSetor = movimentacaoData.filter((item) => {
    const matchEngenheiro =
      engenheiroFiltro === "todos" ||
      item.engenheiro.toLowerCase() === engenheiroFiltro.toLowerCase();
    return (
      departamento.responsaveis
        .map((r) => r.toLowerCase())
        .includes(item.engenheiro.toLowerCase()) && matchEngenheiro
    );
  });

  // Itens de aguardando aprovação que NÃO são análise, orçamento ou execução
  const aguardandoAprovacaoSimples = aguardandoAprovacaoSetor.filter(
    (item) =>
      !(
        item.status.toLowerCase().includes("análise") ||
        item.status.toLowerCase().includes("analise") ||
        item.status.toLowerCase().includes("orçamento") ||
        item.status.toLowerCase().includes("orcamento") ||
        item.status.toLowerCase().includes("execução") ||
        item.status.toLowerCase().includes("execucao") ||
        item.status.toLowerCase().includes("em execução")
      )
  );

  const totalAguardandoAprovacao = aguardandoAprovacaoSimples.length;
  const totalAnalises = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("análise") ||
      item.status.toLowerCase().includes("analise")
  ).length;
  const totalOrcamentos = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("orçamento") ||
      item.status.toLowerCase().includes("orcamento")
  ).length;
  const totalExecucao = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("execução") ||
      item.status.toLowerCase().includes("execucao") ||
      item.status.toLowerCase().includes("em execução")
  ).length;
  const totalDevolucoes = devolucoesSetor.length;
  const totalMovimentacoes = movimentacoesSetor.length;
  const totalItens =
    totalAguardandoAprovacao +
    totalAnalises +
    totalOrcamentos +
    totalExecucao +
    totalDevolucoes +
    totalMovimentacoes;

  // Filtros específicos
  const analises = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("análise") ||
      item.status.toLowerCase().includes("analise")
  );
  const orcamentos = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("orçamento") ||
      item.status.toLowerCase().includes("orcamento")
  );
  const execucao = aguardandoAprovacaoSetor.filter(
    (item) =>
      item.status.toLowerCase().includes("execução") ||
      item.status.toLowerCase().includes("execucao") ||
      item.status.toLowerCase().includes("em execução")
  );

  // Função para obter dados filtrados
  const getDadosFiltrados = () => {
    switch (filtroAtivo) {
      case "followups":
        return {
          aguardandoAprovacao: aguardandoAprovacaoSetor,
          devolucoes: [],
          movimentacoes: [],
        };
      case "analises":
        return { followUps: analises, devolucoes: [], movimentacoes: [] };
      case "orcamentos":
        return {
          aguardandoAprovacao: orcamentos,
          devolucoes: [],
          movimentacoes: [],
        };
      case "execucao":
        return {
          aguardandoAprovacao: execucao,
          devolucoes: [],
          movimentacoes: [],
        };
      case "devolucoes":
        return {
          aguardandoAprovacao: [],
          devolucoes: devolucoesSetor,
          movimentacoes: [],
        };
      case "movimentacoes":
        return {
          aguardandoAprovacao: [],
          devolucoes: [],
          movimentacoes: movimentacoesSetor,
        };
      default:
        return {
          aguardandoAprovacao: aguardandoAprovacaoSetor,
          devolucoes: devolucoesSetor,
          movimentacoes: movimentacoesSetor,
        };
    }
  };

  const dadosFiltrados = useMemo(
    () => getDadosFiltrados(),
    [
      filtroAtivo,
      aguardandoAprovacaoSetor,
      devolucoesSetor,
      movimentacoesSetor,
      analises,
      orcamentos,
      execucao,
    ]
  );

  const totalFiltrado =
    (dadosFiltrados?.aguardandoAprovacao?.length ?? 0) +
    (dadosFiltrados?.devolucoes?.length ?? 0) +
    (dadosFiltrados?.movimentacoes?.length ?? 0);

  // Função para obter o título do filtro
  const getTituloFiltro = () => {
    switch (filtroAtivo) {
      case "followups":
        return "Aguardando Aprovação";
      case "analises":
        return "Análises";
      case "orcamentos":
        return "Orçamentos";
      case "execucao":
        return "Em Execução";
      case "devolucoes":
        return "Devoluções";
      case "movimentacoes":
        return "Movimentações";
      default:
        return "Todos os Itens";
    }
  };

  // Dados para gráficos
  const dadosPorResponsavel = useMemo(
    () =>
      departamento.responsaveis.map((resp) => {
        const aguardandoAprovacao = aguardandoAprovacaoSetor.filter(
          (item) => item.engenheiro.toLowerCase() === resp.toLowerCase()
        );
        const devolucoes = devolucoesSetor.filter(
          (item) => item.engenheiro.toLowerCase() === resp.toLowerCase()
        );
        const movimentacoes = movimentacoesSetor.filter(
          (item) => item.engenheiro.toLowerCase() === resp.toLowerCase()
        );

        return {
          nome: resp,
          aguardandoAprovacao: aguardandoAprovacao.length,
          devolucoes: devolucoes.length,
          movimentacoes: movimentacoes.length,
          total:
            aguardandoAprovacao.length +
            devolucoes.length +
            movimentacoes.length,
        };
      }),
    [
      departamento.responsaveis,
      aguardandoAprovacaoSetor,
      devolucoesSetor,
      movimentacoesSetor,
    ]
  );

  const dadosPorTipo = useMemo(
    () => [
      {
        name: "Aguardando Aprovação",
        value: totalAguardandoAprovacao,
      },
      {
        name: "Devoluções",
        value: totalDevolucoes,
      },
      {
        name: "Movimentações",
        value: totalMovimentacoes,
      },
    ],
    [totalAguardandoAprovacao, totalDevolucoes, totalMovimentacoes]
  );

  // Cálculo dos stats de prazo para cada categoria
  const statsAguardando = getPrazoStats(aguardandoAprovacaoSimples, "data");
  const statsAnalises = getPrazoStats(analises, "data");
  const statsOrcamentos = getPrazoStats(orcamentos, "data");
  const statsExecucao = getPrazoStats(execucao, "data");
  const statsDevolucoes = getPrazoStats(devolucoesSetor, "dataEntrada");
  const statsMovimentacoes = getPrazoStats(
    movimentacoesSetor,
    "dataMovimentacao"
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {departamento.nome}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                Responsáveis: {departamento.responsaveis.join(", ")}
              </p>
              <div className="flex items-center gap-4">
                <Select
                  value={engenheiroFiltro}
                  onValueChange={setEngenheiroFiltro}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por engenheiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os engenheiros</SelectItem>
                    {departamento.responsaveis.map((eng) => (
                      <SelectItem key={eng} value={eng}>
                        {eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="administrativa"
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Administrativa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <MetricsCards
                filtroAtivo={filtroAtivo}
                setFiltroAtivo={setFiltroAtivo}
                totalItens={totalItens}
                totalAguardandoAprovacao={totalAguardandoAprovacao}
                totalAnalises={totalAnalises}
                totalOrcamentos={totalOrcamentos}
                totalExecucao={totalExecucao}
                totalDevolucoes={totalDevolucoes}
                totalMovimentacoes={totalMovimentacoes}
                statsAguardando={statsAguardando}
                statsAnalises={statsAnalises}
                statsOrcamentos={statsOrcamentos}
                statsExecucao={statsExecucao}
                statsDevolucoes={statsDevolucoes}
                statsMovimentacoes={statsMovimentacoes}
              />

              {/* Indicador de filtro ativo */}
              {filtroAtivo !== "todos" && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                    <Badge
                      variant="default"
                      className="flex items-center gap-1"
                    >
                      {getTituloFiltro()}
                      <button
                        onClick={() => setFiltroAtivo("todos")}
                        className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                    <span className="text-sm text-blue-700">
                      Mostrando {totalFiltrado}{" "}
                      {totalFiltrado === 1 ? "item" : "itens"}
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
                <Charts
                  dadosPorResponsavel={dadosPorResponsavel}
                  dadosPorTipo={dadosPorTipo}
                />
              )}

              {/* Lista de itens */}
              {totalFiltrado > 0 && (
                <ItemsList
                  dadosFiltrados={dadosFiltrados}
                  totalFiltrado={totalFiltrado}
                  getTituloFiltro={getTituloFiltro}
                />
              )}
            </TabsContent>

            <TabsContent value="administrativa">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    Carregando...
                  </div>
                }
              >
                <AdministrativeTab
                  data={data}
                  engenheiroFiltro={engenheiroFiltro}
                  setEngenheiroFiltro={setEngenheiroFiltro}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
