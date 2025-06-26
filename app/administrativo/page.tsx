"use client";

import type React from "react";
import * as XLSX from "xlsx";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import {
  Upload,
  BarChart,
  Filter,
  Wrench,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  Home,
  FileSpreadsheet,
} from "lucide-react";
import {
  processExcelFile,
  processDevolucaoFile,
  processMovimentacaoFile,
} from "@/lib/excel-utils";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { isServico, formatCurrency } from "@/lib/utils";

// Adicionar os imports necessários para o Dialog no topo do arquivo
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8884d8"];

export default function AdminPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filtroEngenheiro, setFiltroEngenheiro] = useState("todos");
  const [filtroOrcamentos, setFiltroOrcamentos] = useState<
    "orcamentos" | "faturamento"
  >("orcamentos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const {
    data,
    setData,
    devolucaoData,
    setDevolucaoData,
    movimentacaoData,
    setMovimentacaoData,
    aguardandoAprovacaoData,
    setAguardandoAprovacaoData,
  } = useData();
  const { toast } = useToast();
  const router = useRouter();

  // Adicionar estados para controlar os dialogs logo após os outros estados
  const [isAdminInfoOpen, setIsAdminInfoOpen] = useState(false);
  const [isEngineerInfoOpen, setIsEngineerInfoOpen] = useState(false);

  const [isUploadingFollowUp, setIsUploadingFollowUp] = useState(false);
  const [isUploadingDevolucao, setIsUploadingDevolucao] = useState(false);
  const [isUploadingMovimentacao, setIsUploadingMovimentacao] = useState(false);
  const [followUpUploadError, setFollowUpUploadError] = useState<string | null>(
    null
  );
  const [devolucaoUploadError, setDevolucaoUploadError] = useState<
    string | null
  >(null);
  const [movimentacaoUploadError, setMovimentacaoUploadError] = useState<
    string | null
  >(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    toast({
      title: "Processando...",
      description: `Lendo arquivo: ${file.name}`,
    });

    try {
      console.log(
        "Iniciando processamento do arquivo:",
        file.name,
        "Tamanho:",
        file.size
      );
      const newData = await processExcelFile(file);

      setData(newData);
      toast({
        title: "Sucesso!",
        description: `${newData.length} registros administrativos carregados com sucesso.`,
      });

      event.target.value = "";
    } catch (error) {
      console.error("Erro detalhado:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar arquivo";
      setUploadError(errorMessage);
      toast({
        title: "Erro ao processar arquivo",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExampleDownload = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Orçamento", "OS", "Nome Parceiro", "Responsável", "Valor", "Descrição"],
      ["ORÇ-001", "OS-123", "Cliente A", "Paloma", 1500, "Venda de Serviços"],
      ["ORÇ-001", "OS-123", "Cliente A", "Paloma", 350, "Venda Normal"],
      ["ORÇ-002", "OS-124", "Cliente B", "Giovanni", 2200, "Venda de Serviços"],
      ["ORÇ-003", "OS-125", "Cliente C", "Lucas", 1800, "Venda de Serviços"],
      ["ORÇ-004", "OS-126", "Cliente D", "Marcelo", 500, "Venda Normal"],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, "exemplo-planilha-administrativa.xlsx");
  };

  const handleClearAdminData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados administrativos? Esta ação não pode ser desfeita."
      )
    ) {
      setData([]);
      toast({
        title: "Dados administrativos limpos!",
        description: "Todos os dados administrativos foram removidos.",
      });
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar TODOS os dados (administrativos, follow-ups, devoluções e movimentações)? Esta ação não pode ser desfeita."
      )
    ) {
      setData([]);
      setAguardandoAprovacaoData([]);
      setDevolucaoData([]);
      setMovimentacaoData([]);
      toast({
        title: "Todos os dados limpos!",
        description: "Todos os dados foram removidos do sistema.",
        variant: "destructive",
      });
    }
  };

  const handleFollowUpFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFollowUpUploadError(null);
    setIsUploadingFollowUp(true);

    toast({
      title: "Processando follow-ups...",
      description: `Lendo arquivo: ${file.name}`,
    });

    try {
      const newData = await processFollowUpFile(file);
      if (!Array.isArray(newData)) {
        throw new Error("Dados processados não estão no formato esperado");
      }
      setAguardandoAprovacaoData(newData);
      toast({
        title: "Sucesso!",
        description: `${newData.length} follow-ups carregados com sucesso.`,
      });
      event.target.value = "";
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar arquivo";
      setFollowUpUploadError(errorMessage);
      toast({
        title: "Erro ao processar arquivo de follow-up",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploadingFollowUp(false);
    }
  };

  const handleDevolucaoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDevolucaoUploadError(null);
    setIsUploadingDevolucao(true);

    toast({
      title: "Processando devoluções...",
      description: `Lendo arquivo: ${file.name}`,
    });

    try {
      const newData = await processDevolucaoFile(file);
      setDevolucaoData(newData);
      toast({
        title: "Sucesso!",
        description: `${newData.length} devoluções carregadas com sucesso.`,
      });
      event.target.value = "";
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar arquivo";
      setDevolucaoUploadError(errorMessage);
      toast({
        title: "Erro ao processar arquivo de devoluções",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploadingDevolucao(false);
    }
  };

  const handleMovimentacaoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMovimentacaoUploadError(null);
    setIsUploadingMovimentacao(true);

    toast({
      title: "Processando movimentações...",
      description: `Lendo arquivo: ${file.name}`,
    });

    try {
      const newData = await processMovimentacaoFile(file);
      setMovimentacaoData(newData);
      toast({
        title: "Sucesso!",
        description: `${newData.length} movimentações carregadas com sucesso.`,
      });
      event.target.value = "";
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar arquivo";
      setMovimentacaoUploadError(errorMessage);
      toast({
        title: "Erro ao processar arquivo de movimentações",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploadingMovimentacao(false);
    }
  };

  const handleClearFollowUpData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados de follow-up? Esta ação não pode ser desfeita."
      )
    ) {
      setAguardandoAprovacaoData([]);
      toast({
        title: "Dados de follow-up limpos!",
        description: "Todos os dados de follow-up foram removidos.",
      });
    }
  };

  const handleClearDevolucaoData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados de devoluções? Esta ação não pode ser desfeita."
      )
    ) {
      setDevolucaoData([]);
      toast({
        title: "Dados de devoluções limpos!",
        description: "Todos os dados de devoluções foram removidos.",
      });
    }
  };

  const handleClearMovimentacaoData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados de movimentações? Esta ação não pode ser desfeita."
      )
    ) {
      setMovimentacaoData([]);
      toast({
        title: "Dados de movimentações limpos!",
        description: "Todos os dados de movimentações foram removidos.",
      });
    }
  };

  // Dados administrativos filtrados
  const dadosFiltrados =
    filtroEngenheiro === "todos"
      ? data
      : data.filter((item) => item.responsavel === filtroEngenheiro);

  const engenheiros = [...new Set(data.map((item) => item.responsavel))].filter(
    Boolean
  );

  // Dados dos engenheiros filtrados
  const dadosEngenheirosFiltrados = [];
  const engenheirosProj = [];
  const statusList = [];

  // Usar dados filtrados para os gráficos administrativos
  const dadosPorEngenheiro = engenheiros
    .filter((eng) => filtroEngenheiro === "todos" || eng === filtroEngenheiro)
    .map((eng) => {
      const itens = dadosFiltrados.filter((item) => item.responsavel === eng);
      const orcamentosUnicos = new Set(itens.map((item) => item.orcamento));
      const faturamentoTotal = itens.reduce(
        (sum, item) => sum + (item.valor || 0),
        0
      );

      return {
        nome: eng,
        orcamentos: orcamentosUnicos.size,
        faturamento: faturamentoTotal,
        totalItens: itens.length,
      };
    });

  // Dados para o ranking de engenheiros por orçamentos
  const engenheirosPorOrcamentos = engenheiros.map((eng) => {
    const itensEngenheiro = data.filter((item) => item.responsavel === eng);
    const orcamentosUnicos = new Set(
      itensEngenheiro.map((item) => item.orcamento)
    );

    return {
      nome: eng,
      totalOrcamentos: orcamentosUnicos.size,
      valor: itensEngenheiro.reduce((sum, item) => sum + (item.valor || 0), 0),
    };
  });

  // Dados para o ranking de engenheiros por faturamento
  const engenheirosPorFaturamento = engenheiros.map((eng) => {
    const itensEngenheiro = data.filter((item) => item.responsavel === eng);
    const vendasServicos = itensEngenheiro.filter((item) =>
      isServico(item.descricao)
    );
    const vendasNormais = itensEngenheiro.filter((item) =>
      item.descricao?.toLowerCase().includes("venda normal")
    );

    const totalVendasServicos = vendasServicos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0
    );
    const totalVendasNormais = vendasNormais.reduce(
      (sum, item) => sum + (item.valor || 0),
      0
    );

    return {
      nome: eng,
      totalFaturamento: totalVendasServicos + totalVendasNormais,
      vendasServicos: totalVendasServicos,
      vendasNormais: totalVendasNormais,
      totalItens: vendasServicos.length + vendasNormais.length,
    };
  });

  const topEngenheiros =
    filtroOrcamentos === "orcamentos"
      ? [...engenheirosPorOrcamentos]
          .sort((a, b) => b.totalOrcamentos - a.totalOrcamentos)
          .slice(0, 5)
      : [...engenheirosPorFaturamento]
          .sort((a, b) => b.totalFaturamento - a.totalFaturamento)
          .slice(0, 5);

  const dadosDistribuicaoTipo = [
    {
      name: "Serviços",
      value: dadosFiltrados.filter((item) => isServico(item.descricao)).length,
    },
    {
      name: "Peças",
      value: dadosFiltrados.filter((item) => !isServico(item.descricao)).length,
    },
  ];

  // Estatísticas dos projetos dos engenheiros (dados independentes)
  const projetosPorStatus = [];

  const projetosPorEngenheiro = [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Área Administrativa
            </h1>
            <p className="text-slate-600">
              Gestão completa dos dados operacionais
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao início
              </Link>
            </Button>
            {(data.length > 0 ||
              aguardandoAprovacaoData.length > 0 ||
              devolucaoData.length > 0 ||
              movimentacaoData.length > 0) && (
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Limpar Todos os Dados
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="dados-administrativos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="dados-administrativos"
              className="flex items-center gap-2"
            >
              <BarChart className="w-4 h-4" />
              Dados Administrativos
            </TabsTrigger>
            <TabsTrigger
              value="dados-engenheiros"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Dados dos Engenheiros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-administrativos" className="space-y-6">
            {/* Upload de dados administrativos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>Upload de Dados Administrativos</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600"
                    onClick={() => setIsAdminInfoOpen(true)}
                  >
                    <InfoIcon className="w-4 h-4" />
                    <span>+ Informações</span>
                  </Button>
                </div>
                <CardDescription>
                  Dados para análise administrativa e dashboards gerenciais
                  (orçamentos, faturamento, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-file">Selecionar arquivo</Label>
                    <Input
                      id="admin-file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processando arquivo...</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            Erro ao processar arquivo:
                          </p>
                          <p>{uploadError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearAdminData}
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Limpar Dados Administrativos
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resto do conteúdo administrativo */}
            {data.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <Label>Filtrar por Engenheiro</Label>
                        <Select
                          value={filtroEngenheiro}
                          onValueChange={setFiltroEngenheiro}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">
                              Todos os engenheiros
                            </SelectItem>
                            {engenheiros.map((eng) => (
                              <SelectItem key={eng} value={eng}>
                                {eng}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total de Registros
                      </CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dadosFiltrados.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filtroEngenheiro === "todos"
                          ? "Todos os itens processados"
                          : `Itens de ${filtroEngenheiro}`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Serviços
                      </CardTitle>
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {
                          dadosFiltrados.filter((item) =>
                            isServico(item.descricao)
                          ).length
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Peças
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {
                          dadosFiltrados.filter(
                            (item) => !isServico(item.descricao)
                          ).length
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Valor Total Faturado
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          dadosFiltrados
                            .filter(
                              (item) =>
                                isServico(item.descricao) ||
                                item.descricao
                                  ?.toLowerCase()
                                  .includes("venda normal")
                            )
                            .reduce((sum, item) => sum + (item.valor || 0), 0)
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {`De ${formatCurrency(
                          dadosFiltrados.reduce(
                            (sum, item) => sum + (item.valor || 0),
                            0
                          )
                        )} em orçamentos`}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho por Engenheiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={dadosPorEngenheiro}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="orcamentos"
                            fill="#3b82f6"
                            name="Orçamentos"
                          />
                          <Bar
                            dataKey="faturamento"
                            fill="#10b981"
                            name="Faturamento (R$)"
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Top 5 Engenheiros</CardTitle>
                        <CardDescription>
                          {filtroOrcamentos === "orcamentos"
                            ? "Por quantidade de orçamentos"
                            : "Por faturamento (Venda de Serviços + Venda Normal)"}
                        </CardDescription>
                      </div>
                      <Select
                        value={filtroOrcamentos}
                        onValueChange={(value) =>
                          setFiltroOrcamentos(
                            value as "orcamentos" | "faturamento"
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orcamentos">Orçamentos</SelectItem>
                          <SelectItem value="faturamento">
                            Faturamento
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topEngenheiros.map((eng, index) => (
                          <div
                            key={eng.nome}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                    ? "bg-amber-600"
                                    : "bg-slate-400"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{eng.nome}</p>
                                {filtroOrcamentos === "faturamento" &&
                                  "totalFaturamento" in eng && (
                                    <p className="text-xs text-slate-600">
                                      Serviços:{" "}
                                      {formatCurrency(eng.vendasServicos)} |
                                      Normal:{" "}
                                      {formatCurrency(eng.vendasNormais)}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="text-right">
                              {filtroOrcamentos === "orcamentos" &&
                              "totalOrcamentos" in eng ? (
                                <>
                                  <p className="font-bold">
                                    {eng.totalOrcamentos} orçamentos
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {formatCurrency(eng.valor)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {"totalFaturamento" in eng && (
                                    <p className="font-bold">
                                      {formatCurrency(eng.totalFaturamento)}{" "}
                                      faturado
                                    </p>
                                  )}
                                  <p className="text-sm text-slate-600">
                                    {"totalFaturamento" in eng
                                      ? eng.totalItens
                                      : 0}{" "}
                                    itens
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Dados Operacionais</CardTitle>
                    <CardDescription>
                      {dadosFiltrados.length} registros encontrados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Orçamento</TableHead>
                            <TableHead>OS</TableHead>
                            <TableHead>Nome Parceiro</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dadosFiltrados.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.orcamento}</TableCell>
                              <TableCell>{item.os}</TableCell>
                              <TableCell>{item.nomeParceiro}</TableCell>
                              <TableCell>{item.responsavel}</TableCell>
                              <TableCell>
                                {formatCurrency(item.valor)}
                              </TableCell>
                              <TableCell>{item.descricao}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {data.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                      <BarChart className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Nenhum dado administrativo carregado
                      </h3>
                      <p className="text-slate-500 mb-4">
                        Faça upload de uma planilha com os dados administrativos
                        para começar.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dados-engenheiros" className="space-y-6">
            {/* Upload de Follow-ups */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>Upload de Follow-ups</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Dados de análises, orçamentos, aguardando aprovação e em
                  execução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="followup-file">Selecionar arquivo</Label>
                    <Input
                      id="followup-file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFollowUpFileUpload}
                      disabled={isUploadingFollowUp}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>

                  {isUploadingFollowUp && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">
                        Processando arquivo de follow-up...
                      </span>
                    </div>
                  )}

                  {followUpUploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            Erro ao processar arquivo:
                          </p>
                          <p>{followUpUploadError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {aguardandoAprovacaoData.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearFollowUpData}
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Limpar Follow-ups
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upload de Devoluções */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>Upload de Devoluções Pendentes</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Dados de equipamentos em processo de devolução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="devolucao-file">Selecionar arquivo</Label>
                    <Input
                      id="devolucao-file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleDevolucaoFileUpload}
                      disabled={isUploadingDevolucao}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>

                  {isUploadingDevolucao && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">
                        Processando arquivo de devoluções...
                      </span>
                    </div>
                  )}

                  {devolucaoUploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            Erro ao processar arquivo:
                          </p>
                          <p>{devolucaoUploadError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {devolucaoData.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearDevolucaoData}
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Limpar Devoluções
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upload de Movimentações Internas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>Upload de Movimentações Internas</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Movimentações internas pendentes de orçamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="movimentacao-file">
                      Selecionar arquivo
                    </Label>
                    <Input
                      id="movimentacao-file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleMovimentacaoFileUpload}
                      disabled={isUploadingMovimentacao}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>

                  {isUploadingMovimentacao && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">
                        Processando arquivo de movimentações...
                      </span>
                    </div>
                  )}

                  {movimentacaoUploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            Erro ao processar arquivo:
                          </p>
                          <p>{movimentacaoUploadError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {movimentacaoData.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearMovimentacaoData}
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Limpar Movimentações
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visualizações dos dados */}
            {(aguardandoAprovacaoData.length > 0 ||
              devolucaoData.length > 0 ||
              movimentacaoData.length > 0) && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Follow-ups
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {aguardandoAprovacaoData.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Devoluções
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {devolucaoData.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Movimentações
                    </CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {movimentacaoData.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabelas de dados */}
            {aguardandoAprovacaoData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow-ups</CardTitle>
                  <CardDescription>
                    {aguardandoAprovacaoData.length} itens encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Engenheiro</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Prazo</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Observações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aguardandoAprovacaoData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">
                              {item.id}
                            </TableCell>
                            <TableCell>{item.cliente}</TableCell>
                            <TableCell>{item.engenheiro}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.tipo}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.descricao}
                            </TableCell>
                            <TableCell>{item.prazo}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.prioridade === "Alta"
                                    ? "destructive"
                                    : item.prioridade === "Média"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {item.prioridade}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.observacoes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {devolucaoData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Devoluções Pendentes</CardTitle>
                  <CardDescription>
                    {devolucaoData.length} itens encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Equipamento</TableHead>
                          <TableHead>Engenheiro</TableHead>
                          <TableHead>Data Entrada</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Observações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {devolucaoData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">
                              {item.id}
                            </TableCell>
                            <TableCell>{item.cliente}</TableCell>
                            <TableCell>{item.equipamento}</TableCell>
                            <TableCell>{item.engenheiro}</TableCell>
                            <TableCell>{item.dataEntrada}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.motivoDevolucao}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.status}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.observacoes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {movimentacaoData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Movimentações Internas</CardTitle>
                  <CardDescription>
                    {movimentacaoData.length} itens encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Orçamento</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Engenheiro</TableHead>
                          <TableHead>Tipo Movimentação</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Observações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movimentacaoData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">
                              {item.id}
                            </TableCell>
                            <TableCell>{item.orcamento}</TableCell>
                            <TableCell>{item.cliente}</TableCell>
                            <TableCell>{item.engenheiro}</TableCell>
                            <TableCell>{item.tipoMovimentacao}</TableCell>
                            <TableCell>{item.dataMovimentacao}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.status}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.observacoes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {aguardandoAprovacaoData.length === 0 &&
              devolucaoData.length === 0 &&
              movimentacaoData.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          Nenhum dado carregado
                        </h3>
                        <p className="text-slate-500 mb-4">
                          Faça upload das planilhas de follow-up, devoluções e
                          movimentações para começar.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        </Tabs>

        {/* Dialog para informações sobre dados administrativos */}
        <Dialog open={isAdminInfoOpen} onOpenChange={setIsAdminInfoOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Formato de Dados Administrativos
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre o formato esperado para upload de
                dados administrativos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">
                  Estrutura da Planilha
                </h3>
                <p className="text-blue-700 mb-2">
                  A planilha deve conter uma linha de cabeçalho seguida pelas
                  linhas de dados. O sistema tentará identificar automaticamente
                  as colunas com base nos nomes dos cabeçalhos.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Colunas Esperadas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">Orçamento</p>
                      <p className="text-sm text-slate-600">
                        Número ou código do orçamento
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: ORÇ-001, 2023-0123
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">OS</p>
                      <p className="text-sm text-slate-600">
                        Número da ordem de serviço
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: OS-123, 456789
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">Nome Parceiro</p>
                      <p className="text-sm text-slate-600">
                        Nome do cliente ou parceiro
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: Cliente A, Empresa XYZ
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">Responsável</p>
                      <p className="text-sm text-slate-600">
                        Nome do engenheiro responsável
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: Paloma, Giovanni, Lucas, Marcelo
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">Valor</p>
                      <p className="text-sm text-slate-600">
                        Valor monetário (em reais)
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: 1500, 2200.50, R$ 3.500,00
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold">Descrição</p>
                      <p className="text-sm text-slate-600">
                        Tipo de operação ou descrição
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Exemplos: Venda de Serviços, Venda Normal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Observações Importantes
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                  <li>
                    O sistema tentará identificar as colunas mesmo que os nomes
                    não sejam exatamente iguais
                  </li>
                  <li>
                    Valores monetários podem estar em diferentes formatos (com
                    ou sem símbolo R$, com ponto ou vírgula)
                  </li>
                  <li>
                    Para identificar serviços, o sistema busca palavras como
                    "serviço" ou "venda de serviços" na descrição
                  </li>
                  <li>
                    Cada linha representa um item individual, podendo haver
                    múltiplos itens para o mesmo orçamento
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleExampleDownload}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Baixar Exemplo
              </Button>
              <Button onClick={() => setIsAdminInfoOpen(false)}>Entendi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function handleClearAguardandoAprovacaoData() {
  throw new Error("Function not implemented.");
}

function processFollowUpFile(file: File) {
  throw new Error("Function not implemented.");
}

function setAguardandoAprovacaoData(newData: never[]) {
  throw new Error("Function not implemented.");
}

export type AguardandoAprovacaoItem = {
  id: string;
  cliente: string;
  engenheiro: string;
  tipo: string;
  descricao: string;
  prazo: string;
  prioridade: string;
  observacoes: string;
  // Add any other fields you use
};
