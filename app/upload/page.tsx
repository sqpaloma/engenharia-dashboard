"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processExcelFile } from "@/lib/excel-utils";
import { useData } from "@/lib/data-context";

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

const processExcelFileWithType = async (file: File): Promise<DataItem[]> => {
  return processExcelFile(file) as Promise<DataItem[]>;
};

export default function UploadPage() {
  const {
    setData,
    setAguardandoAprovacaoData,
    setDevolucaoData,
    setMovimentacaoData,
  } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

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
      const newData = await processExcelFileWithType(file);
      const convertedData = newData.map((item) => ({
        id: item.id || String(Math.random()),
        nomeParceiro: item.nomeParceiro || "",
        responsavel: item.responsavel || "",
        status: item.status || "",
        data: item.data || "",
        orcamento: item.orcamento || "",
        valor: item.valor || 0,
        motivo: item.motivo || "",
        observacoes: item.observacoes || "",
        tipo: item.tipo || "",
        os: item.os || "",
        descricao: item.descricao || "",
      }));
      setData(convertedData);
      toast({
        title: "Sucesso!",
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

  const handleClearAdminData = () => {
    setData([]);
    toast({
      title: "Dados limpos",
      description: "Todos os dados administrativos foram removidos.",
    });
  };

  const handleClearAllData = () => {
    setData([]);
    setAguardandoAprovacaoData([]);
    setDevolucaoData([]);
    setMovimentacaoData([]);
    toast({
      title: "Dados limpos",
      description: "Todos os dados foram removidos.",
    });
  };

  const handleAguardandoAprovacaoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const newData = await processExcelFileWithType(file);
      const convertedData = newData.map((item) => ({
        id: item.id || String(Math.random()),
        parceiro: item.nomeParceiro || "",
        engenheiro: item.responsavel || "",
        status: item.status || "",
        data: item.data || "",
        orcamento: item.orcamento || "",
        valor: item.valor || 0,
        observacoes: item.observacoes || "",
        prioridade: "Média",
        prazo: item.data || "",
        descricao: item.descricao || "",
        tipo: item.tipo || "",
        cliente: item.nomeParceiro || "",
      }));
      setAguardandoAprovacaoData(convertedData);
      toast({
        title: "Sucesso!",
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

  const handleDevolucaoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const newData = await processExcelFileWithType(file);
      const convertedData = newData.map((item) => ({
        id: item.id || String(Math.random()),
        parceiro: item.nomeParceiro || "",
        engenheiro: item.responsavel || "",
        dataEntrada: item.data || "",
        motivoDevolucao: item.motivo || "",
        observacoes: item.observacoes || "",
        status: item.status || "",
        equipamento: item.descricao || "",
        cliente: item.nomeParceiro || "",
      }));
      setDevolucaoData(convertedData);
      toast({
        title: "Sucesso!",
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

  const handleMovimentacaoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const newData = await processExcelFileWithType(file);
      const convertedData = newData.map((item) => ({
        id: item.id || String(Math.random()),
        parceiro: item.nomeParceiro || "",
        engenheiro: item.responsavel || "",
        tipoMovimentacao: item.tipo || "",
        dataMovimentacao: item.data || "",
        observacoes: item.observacoes || "",
        status: item.status || "",
        orcamento: item.orcamento || "",
        cliente: item.nomeParceiro || "",
      }));
      setMovimentacaoData(convertedData);
      toast({
        title: "Sucesso!",
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

  const handleClearAguardandoAprovacaoData = () => {
    setAguardandoAprovacaoData([]);
    toast({
      title: "Dados limpos",
      description: "Dados de aguardando aprovação foram removidos.",
    });
  };

  const handleClearDevolucaoData = () => {
    setDevolucaoData([]);
    toast({
      title: "Dados limpos",
      description: "Dados de devolução foram removidos.",
    });
  };

  const handleClearMovimentacaoData = () => {
    setMovimentacaoData([]);
    toast({
      title: "Dados limpos",
      description: "Dados de movimentação foram removidos.",
    });
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>Upload Administrativo</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAdminData}
                  >
                    Limpar Dados
                  </Button>
                </div>
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <CardTitle>UploadOperacionais</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllData}
                  >
                    Limpar Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aguardando-file">
                      Aguardando Aprovação
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="aguardando-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleAguardandoAprovacaoFileUpload}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAguardandoAprovacaoData}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="devolucao-file">Devoluções</Label>
                    <div className="flex gap-2">
                      <Input
                        id="devolucao-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleDevolucaoFileUpload}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearDevolucaoData}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movimentacao-file">Movimentações</Label>
                    <div className="flex gap-2">
                      <Input
                        id="movimentacao-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleMovimentacaoFileUpload}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearMovimentacaoData}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
