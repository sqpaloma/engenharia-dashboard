"use client";

import React, { useState, useMemo, lazy, Suspense } from "react";
import { useData } from "@/lib/data-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricsCards } from "./dashboard/metrics-cards";
import { Charts } from "./dashboard/charts";
import { ItemsList } from "./dashboard/items-list";
import type { FilterType } from "@/types";

const AdministrativeTab = lazy(() => import("./administrative-tab"));

export function DashboardPage() {
  const {
    aguardandoAprovacaoData,
    devolucaoData,
    movimentacaoData,
    setAguardandoAprovacaoData,
    setDevolucaoData,
    setMovimentacaoData,
  } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [engenheiroFiltro, setEngenheiroFiltro] = useState<string>("todos");
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todos");
  const { toast } = useToast();

  const handleClearAllData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar TODOS os dados (aguardando aprovação, devoluções e movimentações)? Esta ação não pode ser desfeita."
      )
    ) {
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

  const filteredData = useMemo(() => {
    if (selectedDepartment === "all") {
      return {
        aguardandoAprovacao: aguardandoAprovacaoData,
        devolucoes: devolucaoData,
        movimentacoes: movimentacaoData,
      };
    }
    return {
      aguardandoAprovacao: aguardandoAprovacaoData.filter(
        (item) => item.engenheiro === selectedDepartment
      ),
      devolucoes: devolucaoData.filter(
        (item) => item.engenheiro === selectedDepartment
      ),
      movimentacoes: movimentacaoData.filter(
        (item) => item.engenheiro === selectedDepartment
      ),
    };
  }, [
    aguardandoAprovacaoData,
    devolucaoData,
    movimentacaoData,
    selectedDepartment,
  ]);

  const totalItens =
    filteredData.aguardandoAprovacao.length +
    filteredData.devolucoes.length +
    filteredData.movimentacoes.length;

  const totalAguardandoAprovacao = filteredData.aguardandoAprovacao.length;
  const totalDevolucoes = filteredData.devolucoes.length;
  const totalMovimentacoes = filteredData.movimentacoes.length;

  const statsAguardando = { percAtrasados: 0, percNoPrazo: 100 };
  const statsAnalises = { percAtrasados: 0, percNoPrazo: 100 };
  const statsOrcamentos = { percAtrasados: 0, percNoPrazo: 100 };
  const statsExecucao = { percAtrasados: 0, percNoPrazo: 100 };
  const statsDevolucoes = { percAtrasados: 0, percNoPrazo: 100 };
  const statsMovimentacoes = { percAtrasados: 0, percNoPrazo: 100 };

  const dadosPorResponsavel = [
    {
      nome: "Todos",
      aguardandoAprovacao: totalAguardandoAprovacao,
      devolucoes: totalDevolucoes,
      movimentacoes: totalMovimentacoes,
      total: totalItens,
    },
  ];

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

  // Convert data to the format expected by AdministrativeTab
  const administrativeData = useMemo(() => {
    const convertToString = (value: React.ReactNode): string => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string") return value;
      if (typeof value === "number") return value.toString();
      if (typeof value === "boolean") return value.toString();
      if (React.isValidElement(value)) {
        const children = value.props.children;
        if (typeof children === "string") return children;
        if (typeof children === "number") return children.toString();
        if (typeof children === "boolean") return children.toString();
        return "";
      }
      return String(value);
    };

    const convertedData = [
      ...filteredData.aguardandoAprovacao.map((item) => ({
        id: item.id,
        nomeParceiro: convertToString(item.cliente),
        responsavel: convertToString(item.engenheiro),
        status: item.status,
        data: item.data,
        orcamento: item.orcamento,
        valor: item.valor,
        observacoes: convertToString(item.observacoes),
        tipo: convertToString(item.tipo),
        os: "",
        descricao: convertToString(item.descricao),
        engenheiro: convertToString(item.engenheiro),
        parceiro: convertToString(item.parceiro),
      })),
      ...filteredData.devolucoes.map((item) => ({
        id: item.id,
        nomeParceiro: convertToString(item.cliente),
        responsavel: convertToString(item.engenheiro),
        status: item.status,
        data: item.dataEntrada,
        orcamento: "",
        valor: 0,
        observacoes: item.observacoes,
        tipo: "Devolução",
        os: "",
        descricao: item.motivoDevolucao,
        engenheiro: convertToString(item.engenheiro),
        parceiro: convertToString(item.parceiro),
      })),
      ...filteredData.movimentacoes.map((item) => ({
        id: item.id,
        nomeParceiro: convertToString(item.cliente),
        responsavel: convertToString(item.engenheiro),
        status: item.status,
        data: item.dataMovimentacao,
        orcamento: item.orcamento,
        valor: 0,
        observacoes: item.observacoes,
        tipo: item.tipoMovimentacao,
        os: "",
        descricao: "",
        engenheiro: convertToString(item.engenheiro),
        parceiro: convertToString(item.parceiro),
      })),
    ];

    return convertedData;
  }, [filteredData]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        {(aguardandoAprovacaoData.length > 0 ||
          devolucaoData.length > 0 ||
          movimentacaoData.length > 0) && (
          <Button onClick={handleClearAllData} variant="destructive" size="sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Limpar Todos os Dados
          </Button>
        )}
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="administrative">Administrativo</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <MetricsCards
            filtroAtivo={filtroAtivo}
            setFiltroAtivo={setFiltroAtivo}
            totalItens={totalItens}
            totalAguardandoAprovacao={totalAguardandoAprovacao}
            totalAnalises={0}
            totalOrcamentos={0}
            totalExecucao={0}
            totalDevolucoes={totalDevolucoes}
            totalMovimentacoes={totalMovimentacoes}
            statsAguardando={statsAguardando}
            statsAnalises={statsAnalises}
            statsOrcamentos={statsOrcamentos}
            statsExecucao={statsExecucao}
            statsDevolucoes={statsDevolucoes}
            statsMovimentacoes={statsMovimentacoes}
          />
          <Charts
            dadosPorResponsavel={dadosPorResponsavel}
            dadosPorTipo={dadosPorTipo}
          />
          <ItemsList
            dadosFiltrados={filteredData}
            totalFiltrado={totalItens}
            getTituloFiltro={() => "Todos os Itens"}
          />
        </TabsContent>
        <TabsContent value="administrative">
          <Suspense fallback={<div>Carregando...</div>}>
            <AdministrativeTab
              data={administrativeData}
              engenheiroFiltro={engenheiroFiltro}
              setEngenheiroFiltro={setEngenheiroFiltro}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
