import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataItem {
  id?: string;
  nomeParceiro?: React.ReactNode;
  responsavel?: React.ReactNode;
  status?: React.ReactNode;
  data?: React.ReactNode;
  orcamento?: React.ReactNode;
  valor?: number;
  motivo?: React.ReactNode;
  observacoes?: React.ReactNode;
  tipo?: React.ReactNode;
  os?: React.ReactNode;
  descricao?: React.ReactNode;
  engenheiro?: React.ReactNode;
  parceiro?: React.ReactNode;
  dataEntrada?: React.ReactNode;
  motivoDevolucao?: React.ReactNode;
  tipoMovimentacao?: React.ReactNode;
  dataMovimentacao?: React.ReactNode;
}

interface ItemsListProps {
  dadosFiltrados: {
    aguardandoAprovacao?: DataItem[];
    devolucoes?: DataItem[];
    movimentacoes?: DataItem[];
  };
  totalFiltrado: number;
  getTituloFiltro: () => string;
}

export function ItemsList({
  dadosFiltrados,
  totalFiltrado,
  getTituloFiltro,
}: ItemsListProps) {
  const [mostrarItens, setMostrarItens] = useState(false);
  const [itemsVisiveis, setItemsVisiveis] = useState(0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div></div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{getTituloFiltro()} do Departamento</CardTitle>
              <p className="text-sm text-slate-600">
                {totalFiltrado}{" "}
                {totalFiltrado === 1 ? "item encontrado" : "itens encontrados"}
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
                ?.slice(0, itemsVisiveis)
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
              {dadosFiltrados.movimentacoes
                ?.slice(0, itemsVisiveis)
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

              {/* Botão Ver Mais */}
              {itemsVisiveis < totalFiltrado && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setItemsVisiveis((prev) => prev + 2)}
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
  );
}
