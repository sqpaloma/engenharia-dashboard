import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for data processing
export function isServico(descricao: string): boolean {
  if (!descricao) return false
  const desc = descricao.toLowerCase()
  return (
    desc.includes("serviço") ||
    desc.includes("servico") ||
    desc.includes("venda de serviços") ||
    desc.includes("venda de servicos")
  )
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
