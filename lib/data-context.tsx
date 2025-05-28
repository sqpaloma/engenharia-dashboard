"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface DataItem {
  orcamento: string
  os: string
  nomeParceiro: string
  responsavel: string
  valor: number
  descricao: string
}

export interface FollowUpItem {
  id: string
  cliente: string
  engenheiro: string
  tipo: string // análises, orçamentos, aguardando aprovação, em execução
  descricao: string
  prazo: string
  prioridade: string
  observacoes: string
}

export interface DevolucaoItem {
  id: string
  cliente: string
  equipamento: string
  engenheiro: string
  dataEntrada: string
  motivoDevolucao: string
  status: string
  observacoes: string
}

export interface MovimentacaoInternaItem {
  id: string
  orcamento: string
  cliente: string
  engenheiro: string
  tipoMovimentacao: string
  dataMovimentacao: string
  status: string
  observacoes: string
}

interface DataContextType {
  data: DataItem[]
  setData: (data: DataItem[]) => void
  followUpData: FollowUpItem[]
  setFollowUpData: (data: FollowUpItem[]) => void
  devolucaoData: DevolucaoItem[]
  setDevolucaoData: (data: DevolucaoItem[]) => void
  movimentacaoData: MovimentacaoInternaItem[]
  setMovimentacaoData: (data: MovimentacaoInternaItem[]) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<DataItem[]>([])
  const [followUpData, setFollowUpDataState] = useState<FollowUpItem[]>([])
  const [devolucaoData, setDevolucaoDataState] = useState<DevolucaoItem[]>([])
  const [movimentacaoData, setMovimentacaoDataState] = useState<MovimentacaoInternaItem[]>([])

  useEffect(() => {
    // Carregar dados administrativos
    const savedData = localStorage.getItem("dashboard-data")
    if (savedData) {
      try {
        setDataState(JSON.parse(savedData))
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
      }
    }

    // Carregar dados de follow-up
    const savedFollowUpData = localStorage.getItem("followup-data")
    if (savedFollowUpData) {
      try {
        setFollowUpDataState(JSON.parse(savedFollowUpData))
      } catch (error) {
        console.error("Erro ao carregar dados de follow-up:", error)
      }
    }

    // Carregar dados de devolução
    const savedDevolucaoData = localStorage.getItem("devolucao-data")
    if (savedDevolucaoData) {
      try {
        setDevolucaoDataState(JSON.parse(savedDevolucaoData))
      } catch (error) {
        console.error("Erro ao carregar dados de devolução:", error)
      }
    }

    // Carregar dados de movimentação
    const savedMovimentacaoData = localStorage.getItem("movimentacao-data")
    if (savedMovimentacaoData) {
      try {
        setMovimentacaoDataState(JSON.parse(savedMovimentacaoData))
      } catch (error) {
        console.error("Erro ao carregar dados de movimentação:", error)
      }
    }
  }, [])

  const setData = (newData: DataItem[]) => {
    setDataState(newData)
    localStorage.setItem("dashboard-data", JSON.stringify(newData))
  }

  const setFollowUpData = (newData: FollowUpItem[]) => {
    setFollowUpDataState(newData)
    localStorage.setItem("followup-data", JSON.stringify(newData))
  }

  const setDevolucaoData = (newData: DevolucaoItem[]) => {
    setDevolucaoDataState(newData)
    localStorage.setItem("devolucao-data", JSON.stringify(newData))
  }

  const setMovimentacaoData = (newData: MovimentacaoInternaItem[]) => {
    setMovimentacaoDataState(newData)
    localStorage.setItem("movimentacao-data", JSON.stringify(newData))
  }

  return (
    <DataContext.Provider value={{ 
      data, 
      setData, 
      followUpData, 
      setFollowUpData, 
      devolucaoData, 
      setDevolucaoData, 
      movimentacaoData, 
      setMovimentacaoData 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
