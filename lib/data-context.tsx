"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export interface DataItem {
  orcamento: string;
  os: string;
  nomeParceiro: string;
  responsavel: string;
  valor: number;
  descricao: string;
}

export interface AguardandoAprovacaoItem {
  id: string;
  orcamento: string;
  parceiro: string;
  engenheiro: string;
  valor: number;
  status: string;
  data: string;
}

export type DevolucaoData = {
  id: string;
  parceiro: string;
  engenheiro: string;
  dataEntrada: string;
  motivoDevolucao: string;
  status: string;
  observacoes: string;
};

export interface MovimentacaoInternaItem {
  id: string;
  orcamento: string;
  parceiro: string;
  engenheiro: string;
  tipoMovimentacao: string;
  dataMovimentacao: string;
  status: string;
  observacoes: string;
}

interface DataContextType {
  data: DataItem[];
  setData: (data: DataItem[]) => void;
  aguardandoAprovacaoData: AguardandoAprovacaoItem[];
  setAguardandoAprovacaoData: (data: AguardandoAprovacaoItem[]) => void;
  devolucaoData: DevolucaoData[];
  setDevolucaoData: (data: DevolucaoData[]) => void;
  movimentacaoData: MovimentacaoInternaItem[];
  setMovimentacaoData: (data: MovimentacaoInternaItem[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<DataItem[]>([]);
  const [aguardandoAprovacaoData, setAguardandoAprovacaoDataState] = useState<
    AguardandoAprovacaoItem[]
  >([]);
  const [devolucaoData, setDevolucaoDataState] = useState<DevolucaoData[]>([]);
  const [movimentacaoData, setMovimentacaoDataState] = useState<
    MovimentacaoInternaItem[]
  >([]);

  useEffect(() => {
    // Carregar dados administrativos
    const savedData = localStorage.getItem("dashboard-data");
    if (savedData) {
      try {
        setDataState(JSON.parse(savedData));
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
      }
    }

    // Carregar dados de aguardando aprovação
    const savedAguardandoAprovacaoData = localStorage.getItem(
      "aguardando-aprovacao-data"
    );
    if (savedAguardandoAprovacaoData) {
      try {
        setAguardandoAprovacaoDataState(
          JSON.parse(savedAguardandoAprovacaoData)
        );
      } catch (error) {
        console.error("Erro ao carregar dados de aguardando aprovação:", error);
      }
    }

    // Carregar dados de devolução
    const savedDevolucaoData = localStorage.getItem("devolucao-data");
    if (savedDevolucaoData) {
      try {
        setDevolucaoDataState(JSON.parse(savedDevolucaoData));
      } catch (error) {
        console.error("Erro ao carregar dados de devolução:", error);
      }
    }

    // Carregar dados de movimentação
    const savedMovimentacaoData = localStorage.getItem("movimentacao-data");
    if (savedMovimentacaoData) {
      try {
        setMovimentacaoDataState(JSON.parse(savedMovimentacaoData));
      } catch (error) {
        console.error("Erro ao carregar dados de movimentação:", error);
      }
    }
  }, []);

  const setData = (newData: DataItem[]) => {
    setDataState(newData);
    localStorage.setItem("dashboard-data", JSON.stringify(newData));
  };

  const setAguardandoAprovacaoData = (newData: AguardandoAprovacaoItem[]) => {
    setAguardandoAprovacaoDataState(newData);
    localStorage.setItem("aguardando-aprovacao-data", JSON.stringify(newData));
  };

  const setDevolucaoData = (newData: DevolucaoData[]) => {
    setDevolucaoDataState(newData);
    localStorage.setItem("devolucao-data", JSON.stringify(newData));
  };

  const setMovimentacaoData = (newData: MovimentacaoInternaItem[]) => {
    setMovimentacaoDataState(newData);
    localStorage.setItem("movimentacao-data", JSON.stringify(newData));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        aguardandoAprovacaoData,
        setAguardandoAprovacaoData,
        devolucaoData,
        setDevolucaoData,
        movimentacaoData,
        setMovimentacaoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
