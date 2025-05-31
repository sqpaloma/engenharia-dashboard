"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseClient } from "./supabaseClient";

export interface DataItem {
  orcamento: string;
  os: string;
  nomeParceiro: string;
  responsavel: string;
  valor: number;
  descricao: string;
}

export interface FollowUpItem {
  id: string;
  cliente: string;
  engenheiro: string;
  tipo: string; // análises, orçamentos, aguardando aprovação, em execução
  descricao: string;
  prazo: string;
  prioridade: string;
  observacoes: string;
  status: string;
}

export interface DevolucaoItem {
  id: string;
  cliente: string;
  equipamento: string;
  engenheiro: string;
  dataEntrada: string;
  motivoDevolucao: string;
  status: string;
  observacoes: string;
}

export interface MovimentacaoInternaItem {
  id: string;
  orcamento: string;
  cliente: string;
  engenheiro: string;
  tipoMovimentacao: string;
  dataMovimentacao: string;
  status: string;
  observacoes: string;
}

interface DataContextType {
  data: DataItem[];
  setData: (data: DataItem[]) => void;
  followUpData: FollowUpItem[];
  setFollowUpData: (data: FollowUpItem[]) => void;
  devolucaoData: DevolucaoItem[];
  setDevolucaoData: (data: DevolucaoItem[]) => void;
  movimentacaoData: MovimentacaoInternaItem[];
  setMovimentacaoData: (data: MovimentacaoInternaItem[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<DataItem[]>([]);
  const [followUpData, setFollowUpDataState] = useState<FollowUpItem[]>([]);
  const [devolucaoData, setDevolucaoDataState] = useState<DevolucaoItem[]>([]);
  const [movimentacaoData, setMovimentacaoDataState] = useState<
    MovimentacaoInternaItem[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn("Supabase client not available.");
        return;
      }

      // Fetch Follow-up Data
      const { data: followUpData, error: followUpError } = await supabase
        .from("followups") // <-- Assuming your table name is 'followups'
        .select("*");

      if (followUpError) {
        console.error("Error fetching follow-up data:", followUpError);
      } else if (followUpData) {
        setFollowUpDataState(followUpData as FollowUpItem[]);
      }

      // Fetch Devolucao Data
      const { data: devolucaoData, error: devolucaoError } = await supabase
        .from("devolucoes") // <-- Assuming your table name is 'devolucoes'
        .select("*");

      if (devolucaoError) {
        console.error("Error fetching devolução data:", devolucaoError);
      } else if (devolucaoData) {
        setDevolucaoDataState(devolucaoData as DevolucaoItem[]);
      }

      // Fetch Movimentacao Data
      const { data: movimentacaoData, error: movimentacaoError } =
        await supabase
          .from("movimentacoes") // <-- Assuming your table name is 'movimentacoes'
          .select("*");

      if (movimentacaoError) {
        console.error("Error fetching movimentação data:", movimentacaoError);
      } else if (movimentacaoData) {
        setMovimentacaoDataState(movimentacaoData as MovimentacaoInternaItem[]);
      }

      // TODO: Fetch administrative data from Supabase if needed
    };

    fetchData();
  }, []);

  const setData = (newData: DataItem[]) => {
    setDataState(newData);
    localStorage.setItem("dashboard-data", JSON.stringify(newData));
  };

  const setFollowUpData = (newData: FollowUpItem[]) => {
    setFollowUpDataState(newData);
    localStorage.setItem("followup-data", JSON.stringify(newData));
  };

  const setDevolucaoData = (newData: DevolucaoItem[]) => {
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
        followUpData,
        setFollowUpData,
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
