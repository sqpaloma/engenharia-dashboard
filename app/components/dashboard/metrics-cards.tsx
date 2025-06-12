import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Wrench } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import type { FilterType } from "@/types";

interface MetricsCardsProps {
  filtroAtivo: FilterType;
  setFiltroAtivo: Dispatch<SetStateAction<FilterType>>;
  totalItens: number;
  totalAguardandoAprovacao: number;
  totalAnalises: number;
  totalOrcamentos: number;
  totalExecucao: number;
  totalDevolucoes: number;
  totalMovimentacoes: number;
  statsAguardando: {
    percAtrasados: number;
    percNoPrazo: number;
  };
  statsAnalises: {
    percAtrasados: number;
    percNoPrazo: number;
  };
  statsOrcamentos: {
    percAtrasados: number;
    percNoPrazo: number;
  };
  statsExecucao: {
    percAtrasados: number;
    percNoPrazo: number;
  };
  statsDevolucoes: {
    percAtrasados: number;
    percNoPrazo: number;
  };
  statsMovimentacoes: {
    percAtrasados: number;
    percNoPrazo: number;
  };
}

export function MetricsCards({
  filtroAtivo,
  setFiltroAtivo,
  totalItens,
  totalAguardandoAprovacao,
  totalAnalises,
  totalOrcamentos,
  totalExecucao,
  totalDevolucoes,
  totalMovimentacoes,
  statsAguardando,
  statsAnalises,
  statsOrcamentos,
  statsExecucao,
  statsDevolucoes,
  statsMovimentacoes,
}: MetricsCardsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          filtroAtivo === "todos" ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
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
        className={`cursor-pointer transition-colors ${
          filtroAtivo === "aguardandoAprovacao"
            ? "bg-blue-50 border-blue-200"
            : "hover:bg-slate-50"
        }`}
        onClick={() => setFiltroAtivo("aguardandoAprovacao")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Aguardando Aprovação
          </CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalAguardandoAprovacao}</div>
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
          filtroAtivo === "analises" ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={() => setFiltroAtivo("analises")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Análises</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalAnalises}</div>
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
          filtroAtivo === "orcamentos" ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={() => setFiltroAtivo("orcamentos")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalOrcamentos}</div>
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
          filtroAtivo === "execucao" ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={() => setFiltroAtivo("execucao")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
          <Package className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalExecucao}</div>
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
          filtroAtivo === "devolucoes" ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={() => setFiltroAtivo("devolucoes")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Devoluções</CardTitle>
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
          <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
          <Package className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalMovimentacoes}</div>
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
  );
}
