import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface AdministrativeTabProps {
  data: DataItem[];
  engenheiroFiltro: string;
  setEngenheiroFiltro: (value: string) => void;
}

export default function AdministrativeTab({
  data,
  engenheiroFiltro,
  setEngenheiroFiltro,
}: AdministrativeTabProps) {
  return (
    <div className="space-y-8">
      {/* Filtro por engenheiro */}
      <div className="flex items-center justify-between">
        <Select value={engenheiroFiltro} onValueChange={setEngenheiroFiltro}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Todos os engenheiros" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os engenheiros</SelectItem>
            {[
              ...new Set(
                data
                  .map((item) => item.responsavel)
                  .filter((r): r is string => Boolean(r))
              ),
            ].map((eng) => (
              <SelectItem key={eng} value={eng}>
                {eng}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de totais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <p className="text-slate-500 text-sm mb-1">Total de Registros</p>
            <div className="text-3xl font-bold">{data.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              Todos os itens processados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-slate-500 text-sm mb-1">Total Serviços</p>
            <div className="text-3xl font-bold">
              {
                data.filter((item) =>
                  (item.descricao || "").toLowerCase().includes("serviço")
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-slate-500 text-sm mb-1">Total Peças</p>
            <div className="text-3xl font-bold">
              {
                data.filter((item) =>
                  (item.descricao || "").toLowerCase().includes("peça")
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-slate-500 text-sm mb-1">Valor Total Faturado</p>
            <div className="text-2xl font-bold">
              {data
                .reduce((acc, item) => acc + (item.valor || 0), 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              De{" "}
              {data
                .reduce((acc, item) => acc + (item.valor || 0), 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
              em orçamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico e Ranking */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Gráfico de desempenho por engenheiro (placeholder) */}
        <Card className="min-h-[300px] flex flex-col">
          <CardContent className="flex-1 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-2 w-full">
              Desempenho por Engenheiro
            </h2>
            {/* Aqui pode ser inserido um gráfico real futuramente */}
            <div className="w-full h-48 flex items-center justify-center bg-slate-100 rounded">
              <span className="text-slate-400">
                (Gráfico de barras/linhas aqui)
              </span>
            </div>
          </CardContent>
        </Card>
        {/* Ranking dos Top 5 Engenheiros */}
        <Card>
          <CardContent className="py-6">
            <h2 className="text-xl font-bold mb-2">Top 5 Engenheiros</h2>
            <p className="text-sm text-slate-500 mb-4">
              Por quantidade de orçamentos
            </p>
            <div className="space-y-2">
              {Object.entries(
                data.reduce((acc, item) => {
                  if (!item.responsavel) return acc;
                  if (!acc[item.responsavel])
                    acc[item.responsavel] = { count: 0, valor: 0 };
                  acc[item.responsavel].count += 1;
                  acc[item.responsavel].valor += item.valor || 0;
                  return acc;
                }, {} as Record<string, { count: number; valor: number }>)
              )
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5)
                .map(([eng, stats], idx) => (
                  <div
                    key={eng}
                    className="flex items-center justify-between bg-slate-50 rounded px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-lg ${
                          idx === 0
                            ? "text-yellow-500"
                            : idx === 1
                            ? "text-gray-400"
                            : idx === 2
                            ? "text-orange-500"
                            : "text-slate-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{eng}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">
                        {stats.count} orçamentos
                      </span>
                      <div className="text-xs text-slate-500">
                        {stats.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista detalhada dos dados administrativos */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Administrativos</CardTitle>
            <p className="text-sm text-slate-600">
              Total de registros: {data.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.length > 0 ? (
                <div className="grid gap-4">
                  {data.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.orcamento || "Sem orçamento"}
                          </h3>
                          <p className="text-sm text-slate-600">
                            OS: {item.os || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="font-medium">Valor:</span>{" "}
                            {item.valor?.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }) || "N/A"}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Data:</span>{" "}
                            {item.data || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <span className="font-medium">Parceiro:</span>{" "}
                            {item.nomeParceiro || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Responsável:</span>{" "}
                            {item.responsavel || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            {item.status || "N/A"}
                          </p>
                          {item.descricao && (
                            <p>
                              <span className="font-medium">Descrição:</span>{" "}
                              {item.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                      {item.observacoes && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                          <p className="font-medium">Observações:</p>
                          <p>{item.observacoes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>Nenhum dado administrativo carregado.</p>
                  <p className="text-sm mt-2">
                    Faça upload de um arquivo na página de upload para ver os
                    dados aqui.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
