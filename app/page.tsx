"use client";
import { lazy } from "react";

import { DashboardPage } from "./components/dashboard-page";

type DataItem = {
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
};

const DEPARTAMENTOS = {
  "bombas-pistoes": {
    nome: "Bombas e motores de pistões e engrenagem",
    responsaveis: ["Paloma", "Giovanni"],
  },
  "bombas-escavadeira": {
    nome: "Bombas, motores e comandos de escavadeira",
    responsaveis: ["Lucas"],
  },
  "blocos-valvulas": {
    nome: "Blocos, válvulas, orbitrol e pedal de freio",
    responsaveis: ["Marcelo"],
  },
};

// Função utilitária para converter datas em vários formatos para Date
function parsePrazo(prazoStr: string | undefined): Date | null {
  if (!prazoStr) return null;
  const parts = prazoStr.includes("/")
    ? prazoStr.split("/")
    : prazoStr.split("-");
  if (parts.length !== 3) return null;
  let [dia, mes, ano] = parts;
  if (ano.length === 2) {
    const anoNum = parseInt(ano, 10);
    ano = anoNum < 50 ? `20${ano}` : `19${ano}`;
  }
  return new Date(
    `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T23:59:59`
  );
}

function getPrazoStats<T>(
  lista: T[],
  campoData: keyof T
): {
  atrasados: number;
  noPrazo: number;
  total: number;
  percAtrasados: number;
  percNoPrazo: number;
} {
  const hoje = new Date();
  let atrasados = 0;
  let noPrazo = 0;
  let total = 0;
  lista.forEach((item) => {
    const prazo = parsePrazo(item[campoData] as string);
    if (prazo) {
      total++;
      if (prazo < hoje) {
        atrasados++;
      } else {
        noPrazo++;
      }
    }
  });
  return {
    atrasados,
    noPrazo,
    total,
    percAtrasados: total ? Math.round((atrasados / total) * 100) : 0,
    percNoPrazo: total ? Math.round((noPrazo / total) * 100) : 0,
  };
}

// Lazy load the administrative tab content
const AdministrativeTab = lazy(() => import("./components/administrative-tab"));

export default function Home() {
  return <DashboardPage />;
}
