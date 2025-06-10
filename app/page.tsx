"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/data-context";
import { BarChart3, Package, Wrench, X, ArrowLeft } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sidebar } from "@/components/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processExcelFile } from "@/lib/excel-utils";
import { ResponsivePie } from "@nivo/pie";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
  // Aceita separador '-' ou '/'
  const parts = prazoStr.includes("/")
    ? prazoStr.split("/")
    : prazoStr.split("-");
  if (parts.length !== 3) return null;
  let [dia, mes, ano] = parts;
  // Corrige ano de dois dígitos
  if (ano.length === 2) {
    const anoNum = parseInt(ano, 10);
    ano = anoNum < 50 ? `20${ano}` : `19${ano}`;
  }
  return new Date(
    `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T23:59:59`
  ); // fim do dia
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

// Add type assertion for processExcelFile
const processExcelFileWithType = async (file: File): Promise<DataItem[]> => {
  return processExcelFile(file) as Promise<DataItem[]>;
};

export default function DashboardPage() {
  const { aguardandoAprovacaoData, devolucaoData, movimentacaoData } =
    useData();
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todos");
  const [engenheiroFiltro, setEngenheiroFiltro] = useState<string>("todos");
  const [itemsVisiveis, setItemsVisiveis] = useState(0);
  const [mostrarItens, setMostrarItens] = useState(false);
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

  const dadosFiltrados = getDadosFiltrados();
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
  const dadosPorResponsavel = departamento.responsaveis.map((resp) => {
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
        aguardandoAprovacao.length + devolucoes.length + movimentacoes.length,
    };
  });

  const dadosPorTipo = [
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
  ];

  // Cálculo dos stats de prazo para cada categoria, passando o campo correto:
  const statsAguardando = getPrazoStats(aguardandoAprovacaoSimples, "data");
  const statsAnalises = getPrazoStats(analises, "data");
  const statsOrcamentos = getPrazoStats(orcamentos, "data");
  const statsExecucao = getPrazoStats(execucao, "data");
  const statsDevolucoes = getPrazoStats(devolucoesSetor, "dataEntrada");
  const statsMovimentacoes = getPrazoStats(
    movimentacoesSetor,
    "dataMovimentacao"
  );

  // LOGS DE DEPURAÇÃO PARA VERIFICAR OS DADOS E OS CAMPOS DE DATA
  console.log(
    "aguardandoAprovacaoSimples:",
    aguardandoAprovacaoSimples.map((i) => i.data)
  );
  console.log(
    "analises:",
    analises.map((i) => i.data)
  );
  console.log(
    "orcamentos:",
    orcamentos.map((i) => i.data)
  );
  console.log(
    "execucao:",
    execucao.map((i) => i.data)
  );
  console.log(
    "devolucoesSetor:",
    devolucoesSetor.map((i) => i.dataEntrada)
  );
  console.log(
    "movimentacoesSetor:",
    movimentacoesSetor.map((i) => i.dataMovimentacao)
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
              {/* Métricas principais */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "todos"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("todos")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Itens
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalItens}</div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "followups"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("followups")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Aguardando Aprovação
                    </CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {totalAguardandoAprovacao}
                    </div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsAguardando.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsAguardando.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "analises"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("analises")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Análises
                    </CardTitle>
                    <Package className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">{analises.length}</div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsAnalises.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsAnalises.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "orcamentos"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("orcamentos")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Orçamentos
                    </CardTitle>
                    <Package className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {orcamentos.length}
                    </div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsOrcamentos.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsOrcamentos.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "execucao"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("execucao")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Em Execução
                    </CardTitle>
                    <Package className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">{execucao.length}</div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsExecucao.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsExecucao.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "devolucoes"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("devolucoes")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Devoluções
                    </CardTitle>
                    <Package className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">{totalDevolucoes}</div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsDevolucoes.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsDevolucoes.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    filtroAtivo === "movimentacoes"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setFiltroAtivo("movimentacoes")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Movimentações
                    </CardTitle>
                    <Package className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {totalMovimentacoes}
                    </div>
                    <div className="absolute bottom-2 right-3 flex gap-1 items-end">
                      <span className="text-xs text-red-400 font-semibold">
                        {statsMovimentacoes.percAtrasados}%
                      </span>
                      <span className="text-xs text-green-400 font-semibold">
                        {statsMovimentacoes.percNoPrazo}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Itens por Responsável</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={dadosPorResponsavel}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="aguardandoAprovacao"
                            fill="#f59e0b"
                            name="Aguardando Aprovação"
                          />
                          <Bar
                            dataKey="devolucoes"
                            fill="#10b981"
                            name="Devoluções"
                          />
                          <Bar
                            dataKey="movimentacoes"
                            fill="#ef4444"
                            name="Movimentações"
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 300 }}>
                        <ResponsivePie
                          data={dadosPorTipo}
                          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                          innerRadius={0.5}
                          padAngle={0.7}
                          cornerRadius={3}
                          activeOuterRadiusOffset={8}
                          borderWidth={1}
                          borderColor={{
                            from: "color",
                            modifiers: [["darker", 0.2]],
                          }}
                          arcLinkLabelsSkipAngle={10}
                          arcLinkLabelsTextColor="#333333"
                          arcLinkLabelsThickness={2}
                          arcLinkLabelsColor={{ from: "color" }}
                          arcLabelsSkipAngle={10}
                          arcLabelsTextColor={{
                            from: "color",
                            modifiers: [["darker", 2]],
                          }}
                          defs={[
                            {
                              id: "dots",
                              type: "patternDots",
                              background: "inherit",
                              color: "rgba(255, 255, 255, 0.3)",
                              size: 4,
                              padding: 1,
                              stagger: true,
                            },
                            {
                              id: "lines",
                              type: "patternLines",
                              background: "inherit",
                              color: "rgba(255, 255, 255, 0.3)",
                              rotation: -45,
                              lineWidth: 6,
                              spacing: 10,
                            },
                          ]}
                          legends={[
                            {
                              anchor: "bottom",
                              direction: "row",
                              justify: false,
                              translateX: 0,
                              translateY: 56,
                              itemsSpacing: 0,
                              itemWidth: 100,
                              itemHeight: 18,
                              itemTextColor: "#999",
                              itemDirection: "left-to-right",
                              itemOpacity: 1,
                              symbolSize: 18,
                              symbolShape: "circle",
                              effects: [
                                {
                                  on: "hover",
                                  style: {
                                    itemTextColor: "#000",
                                  },
                                },
                              ],
                            },
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Lista de projetos do setor */}
              {totalFiltrado > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div></div>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>
                            {getTituloFiltro()} do Departamento
                          </CardTitle>
                          <p className="text-sm text-slate-600">
                            {totalFiltrado}{" "}
                            {totalFiltrado === 1
                              ? "item encontrado"
                              : "itens encontrados"}
                          </p>
                        </div>
                        {!mostrarItens ? (
                          <Button
                            onClick={() => {
                              setMostrarItens(true);
                              setItemsVisiveis(2);
                            }}
                            variant="outline"
                          >
                            Ver itens
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setMostrarItens(false);
                              setItemsVisiveis(0);
                            }}
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Ocultar lista
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    {mostrarItens && (
                      <CardContent>
                        <div className="space-y-4">
                          {dadosFiltrados?.aguardandoAprovacao
                            ?.slice(0, itemsVisiveis)
                            .map((item, index) => (
                              <div
                                key={`fu-${index}`}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg">
                                      {item.orcamento}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      Valor: {item.valor}
                                    </p>
                                  </div>
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.status}
                                  </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p>
                                      <strong>Data:</strong> {item.data}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Devoluções */}
                          {dadosFiltrados.devolucoes
                            .slice(0, itemsVisiveis)
                            .map((item, index) => (
                              <div
                                key={`dev-${index}`}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="text-sm text-slate-600">
                                      ID: {item.id} | Tipo: Devolução
                                    </p>
                                  </div>
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {item.status}
                                  </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p>
                                      <strong>Parceiro:</strong> {item.parceiro}
                                    </p>
                                    <p>
                                      <strong>Responsável:</strong>{" "}
                                      {item.engenheiro}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong>Data Entrada:</strong>{" "}
                                      {item.dataEntrada}
                                    </p>
                                    <p>
                                      <strong>Motivo:</strong>{" "}
                                      {item.motivoDevolucao}
                                    </p>
                                    {item.observacoes && (
                                      <p>
                                        <strong>Observações:</strong>{" "}
                                        {item.observacoes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Movimentações */}
                          {dadosFiltrados.movimentacoes
                            .slice(0, itemsVisiveis)
                            .map((item, index) => (
                              <div
                                key={`mov-${index}`}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg">
                                      {item.orcamento}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      ID: {item.id} | Tipo: Movimentação Interna
                                    </p>
                                  </div>
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {item.status}
                                  </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p>
                                      <strong>Parceiro:</strong> {item.parceiro}
                                    </p>
                                    <p>
                                      <strong>Responsável:</strong>{" "}
                                      {item.engenheiro}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong>Tipo:</strong>{" "}
                                      {item.tipoMovimentacao}
                                    </p>
                                    <p>
                                      <strong>Data:</strong>{" "}
                                      {item.dataMovimentacao}
                                    </p>
                                    {item.observacoes && (
                                      <p>
                                        <strong>Observações:</strong>{" "}
                                        {item.observacoes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Botão Ver Mais */}
                          {itemsVisiveis < totalFiltrado && (
                            <div className="flex justify-center mt-6">
                              <Button
                                onClick={() =>
                                  setItemsVisiveis((prev) => prev + 2)
                                }
                                variant="outline"
                                className="w-full max-w-xs"
                              >
                                Ver mais
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="administrativa">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Painel Administrativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Departamentos
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {Object.entries(DEPARTAMENTOS).map(
                                ([key, dept]) => (
                                  <div
                                    key={key}
                                    className="p-3 bg-slate-50 rounded-lg"
                                  >
                                    <h3 className="font-semibold">
                                      {dept.nome}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                      Responsáveis:{" "}
                                      {dept.responsaveis.join(", ")}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Estatísticas Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-600">
                                    Total de Itens
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {totalItens}
                                  </p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-600">
                                    Total de Responsáveis
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {departamento.responsaveis.length}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
