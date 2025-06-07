import * as XLSX from "xlsx";
import type {
  DataItem,
  AguardandoAprovacaoItem,
  DevolucaoItem,
  MovimentacaoInternaItem,
} from "./data-context";

export async function processExcelFile(file: File): Promise<DataItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log("Arquivo lido com sucesso, processando...");

        let workbook;
        const data = e.target?.result;

        if (!data) {
          throw new Error("Não foi possível ler o arquivo");
        }

        try {
          if (data instanceof ArrayBuffer) {
            workbook = XLSX.read(new Uint8Array(data), {
              type: "array",
              cellDates: true,
              cellNF: false,
              cellText: false,
              raw: true,
            });
          } else if (typeof data === "string") {
            workbook = XLSX.read(data, {
              type: "binary",
              cellDates: true,
              cellNF: false,
              cellText: false,
              raw: true,
            });
          } else {
            throw new Error("Formato de dados não suportado");
          }
        } catch (readError) {
          console.error("Erro na primeira tentativa de leitura:", readError);

          if (typeof data === "string") {
            workbook = XLSX.read(data, { type: "string" });
          } else if (data instanceof ArrayBuffer) {
            const array = new Uint8Array(data);
            let binaryString = "";
            for (let i = 0; i < array.length; i++) {
              binaryString += String.fromCharCode(array[i]);
            }
            workbook = XLSX.read(binaryString, { type: "binary" });
          } else {
            throw new Error("Não foi possível processar o arquivo");
          }
        }

        if (
          !workbook ||
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          throw new Error("Arquivo Excel inválido ou corrompido");
        }

        console.log("Planilhas encontradas:", workbook.SheetNames);

        let jsonData = null;
        let sheetName = "";

        for (const sheet of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheet];
          if (!worksheet) continue;

          const sheetData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            blankrows: false,
            raw: true,
          });

          if (sheetData && sheetData.length > 0) {
            jsonData = sheetData;
            sheetName = sheet;
            break;
          }
        }

        if (!jsonData || jsonData.length === 0) {
          throw new Error("Nenhum dado encontrado em nenhuma planilha");
        }

        console.log(
          `Usando planilha: ${sheetName} com ${jsonData.length} linhas`
        );

        if (jsonData.length < 2) {
          throw new Error(
            "A planilha precisa ter pelo menos uma linha de cabeçalho e uma linha de dados"
          );
        }

        const headers = (jsonData[0] as any[]).map((h) =>
          h !== null && h !== undefined ? String(h).toLowerCase().trim() : ""
        );

        console.log("Cabeçalhos encontrados:", headers);

        if (headers.filter((h) => h).length === 0) {
          throw new Error("Nenhum cabeçalho válido encontrado na planilha");
        }

        const rows = jsonData.slice(1) as any[][];
        console.log(`Processando ${rows.length} linhas de dados`);

        const getColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(
              (header) => header && header.includes(name.toLowerCase())
            );
            if (index !== -1) return index;
          }
          return -1;
        };

        const orcamentoIndex = getColumnIndex([
          "orçamento",
          "orcamento",
          "budget",
          "orç",
          "orc",
        ]);
        const osIndex = getColumnIndex([
          "os",
          "ordem",
          "order",
          "service",
          "serviço",
        ]);
        const parceiroIndex = getColumnIndex([
          "parceiro",
          "nome",
          "partner",
          "client",
          "name",
        ]);
        const responsavelIndex = getColumnIndex([
          "responsável",
          "responsavel",
          "responsible",
          "resp",
        ]);
        const valorIndex = getColumnIndex([
          "valor",
          "value",
          "price",
          "preço",
          "preco",
        ]);
        const descricaoIndex = getColumnIndex([
          "descrição",
          "descricao",
          "tipo",
          "description",
          "type",
          "desc",
        ]);

        console.log("Índices das colunas:", {
          orcamento: orcamentoIndex,
          os: osIndex,
          parceiro: parceiroIndex,
          responsavel: responsavelIndex,
          valor: valorIndex,
          descricao: descricaoIndex,
        });

        if (
          responsavelIndex === -1 &&
          orcamentoIndex === -1 &&
          osIndex === -1
        ) {
          throw new Error(
            "Não foi possível identificar as colunas essenciais (Responsável, Orçamento ou OS)"
          );
        }

        const processedData: DataItem[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          if (!row || !Array.isArray(row) || row.length === 0) continue;

          const hasContent = row.some(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );

          if (!hasContent) continue;

          let valor = 0;
          if (
            valorIndex >= 0 &&
            row[valorIndex] !== undefined &&
            row[valorIndex] !== null
          ) {
            console.log(
              `Valor original (linha ${i + 2}):`,
              row[valorIndex],
              typeof row[valorIndex]
            );

            if (typeof row[valorIndex] === "number") {
              valor = row[valorIndex];
            } else {
              const valorStr = String(row[valorIndex])
                .replace(/[^\d.,-]/g, "")
                .replace(",", ".");

              valor = Number.parseFloat(valorStr) || 0;
            }

            console.log(`Valor processado (linha ${i + 2}):`, valor);
          }

          const item: DataItem = {
            orcamento:
              orcamentoIndex >= 0 ? String(row[orcamentoIndex] || "") : "",
            os: osIndex >= 0 ? String(row[osIndex] || "") : "",
            nomeParceiro:
              parceiroIndex >= 0 ? String(row[parceiroIndex] || "") : "",
            responsavel:
              responsavelIndex >= 0 ? String(row[responsavelIndex] || "") : "",
            valor: valor,
            descricao:
              descricaoIndex >= 0 ? String(row[descricaoIndex] || "") : "",
          };

          if (
            item.orcamento ||
            item.os ||
            item.responsavel ||
            item.nomeParceiro
          ) {
            processedData.push(item);
          }
        }

        console.log(`Dados processados: ${processedData.length} itens válidos`);

        if (processedData.length === 0) {
          throw new Error(
            "Nenhum dado válido encontrado na planilha após processamento"
          );
        }

        resolve(processedData);
      } catch (error) {
        console.error("Erro detalhado ao processar planilha:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Erro na leitura do arquivo:", error);
      reject(
        new Error(
          "Erro ao ler arquivo: " + (error?.target as any)?.error?.message ||
            "Erro desconhecido"
        )
      );
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function processAguardandoAprovacaoFile(
  file: File
): Promise<AguardandoAprovacaoItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log("Processando arquivo de aguardando aprovação...");

        let workbook;
        const data = e.target?.result;

        if (!data) {
          throw new Error("Não foi possível ler o arquivo");
        }

        if (data instanceof ArrayBuffer) {
          workbook = XLSX.read(new Uint8Array(data), {
            type: "array",
            cellDates: true,
            raw: true,
          });
        } else {
          throw new Error("Formato de dados não suportado");
        }

        if (
          !workbook ||
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          throw new Error("Arquivo Excel inválido ou corrompido");
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
          raw: true,
        }) as any[][];

        if (!jsonData || jsonData.length < 2) {
          throw new Error(
            "Planilha deve ter pelo menos cabeçalho e uma linha de dados"
          );
        }

        const headers = (jsonData[0] as any[]).map((h) =>
          h !== null && h !== undefined ? String(h).toLowerCase().trim() : ""
        );

        const rows = jsonData.slice(1);

        const getColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(
              (header) => header && header.includes(name.toLowerCase())
            );
            if (index !== -1) return index;
          }
          return -1;
        };

        const idIndex = getColumnIndex(["id", "código", "codigo"]);
        const orcamentoIndex = getColumnIndex([
          "orçamento",
          "orcamento",
          "budget",
        ]);
        const parceiroIndex = getColumnIndex([
          "parceiro",
          "client",
          "customer",
        ]);
        const engenheiroIndex = getColumnIndex([
          "engenheiro",
          "engineer",
          "responsável",
          "responsavel",
        ]);
        const valorIndex = getColumnIndex([
          "valor",
          "value",
          "price",
          "preço",
          "preco",
        ]);
        const statusIndex = getColumnIndex([
          "status",
          "situação",
          "situacao",
          "estado",
        ]);
        const dataIndex = getColumnIndex(["data", "date"]);

        const processedData: AguardandoAprovacaoItem[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          if (!row || !Array.isArray(row) || row.length === 0) continue;

          const hasContent = row.some(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );
          if (!hasContent) continue;

          let valor = 0;
          if (
            valorIndex >= 0 &&
            row[valorIndex] !== undefined &&
            row[valorIndex] !== null
          ) {
            console.log(
              `Valor original (linha ${i + 2}):`,
              row[valorIndex],
              typeof row[valorIndex]
            );

            if (typeof row[valorIndex] === "number") {
              valor = row[valorIndex];
            } else {
              const valorStr = String(row[valorIndex])
                .replace(/[^\d.,-]/g, "")
                .replace(",", ".");

              valor = Number.parseFloat(valorStr) || 0;
            }

            console.log(`Valor processado (linha ${i + 2}):`, valor);
          }

          const item: AguardandoAprovacaoItem = {
            id:
              idIndex >= 0
                ? String(row[idIndex] || `APR-${i + 1}`)
                : `APR-${i + 1}`,
            orcamento:
              orcamentoIndex >= 0 ? String(row[orcamentoIndex] || "") : "",
            parceiro:
              parceiroIndex >= 0 ? String(row[parceiroIndex] || "") : "",
            engenheiro:
              engenheiroIndex >= 0 ? String(row[engenheiroIndex] || "") : "",
            valor: valor,
            status: statusIndex >= 0 ? String(row[statusIndex] || "") : "",
            data: dataIndex >= 0 ? String(row[dataIndex] || "") : "",
          };

          if (item.orcamento || item.parceiro || item.engenheiro) {
            processedData.push(item);
          }
        }

        console.log(
          `Dados de aguardando aprovação processados: ${processedData.length} itens`
        );

        if (processedData.length === 0) {
          throw new Error(
            "Nenhum dado válido encontrado na planilha de aguardando aprovação"
          );
        }

        resolve(processedData);
      } catch (error) {
        console.error(
          "Erro ao processar planilha de aguardando aprovação:",
          error
        );
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Erro na leitura do arquivo:", error);
      reject(
        new Error(
          "Erro ao ler arquivo: " + (error?.target as any)?.error?.message ||
            "Erro desconhecido"
        )
      );
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function processDevolucaoFile(
  file: File
): Promise<DevolucaoItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log("Processando arquivo de devoluções...");

        let workbook;
        const data = e.target?.result;

        if (!data) {
          throw new Error("Não foi possível ler o arquivo");
        }

        if (data instanceof ArrayBuffer) {
          workbook = XLSX.read(new Uint8Array(data), {
            type: "array",
            cellDates: true,
            raw: true,
          });
        } else {
          throw new Error("Formato de dados não suportado");
        }

        if (
          !workbook ||
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          throw new Error("Arquivo Excel inválido ou corrompido");
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
          raw: true,
        }) as any[][];

        if (!jsonData || jsonData.length < 2) {
          throw new Error(
            "Planilha deve ter pelo menos cabeçalho e uma linha de dados"
          );
        }

        const headers = (jsonData[0] as any[]).map((h) =>
          h !== null && h !== undefined ? String(h).toLowerCase().trim() : ""
        );

        const rows = jsonData.slice(1);

        const getColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(
              (header) => header && header.includes(name.toLowerCase())
            );
            if (index !== -1) return index;
          }
          return -1;
        };

        const idIndex = getColumnIndex(["id", "código", "codigo"]);
        const parceiroIndex = getColumnIndex([
          "parceiro",
          "client",
          "customer",
        ]);
        const equipamentoIndex = getColumnIndex([
          "equipamento",
          "equipment",
          "produto",
          "product",
        ]);
        const engenheiroIndex = getColumnIndex([
          "engenheiro",
          "engineer",
          "responsável",
          "responsavel",
        ]);
        const dataEntradaIndex = getColumnIndex([
          "data entrada",
          "entrada",
          "data",
          "date",
        ]);
        const motivoIndex = getColumnIndex([
          "motivo",
          "reason",
          "motivo devolução",
          "motivo devolucao",
        ]);
        const statusIndex = getColumnIndex([
          "status",
          "situação",
          "situacao",
          "estado",
        ]);
        const observacoesIndex = getColumnIndex([
          "observações",
          "observacoes",
          "notes",
          "comentários",
          "comentarios",
        ]);

        const processedData: DevolucaoItem[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          if (!row || !Array.isArray(row) || row.length === 0) continue;

          const hasContent = row.some(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );
          if (!hasContent) continue;

          const item: DevolucaoItem = {
            id:
              idIndex >= 0
                ? String(row[idIndex] || `DEV-${i + 1}`)
                : `DEV-${i + 1}`,
            parceiro:
              parceiroIndex >= 0 ? String(row[parceiroIndex] || "") : "",
            equipamento:
              equipamentoIndex >= 0 ? String(row[equipamentoIndex] || "") : "",
            engenheiro:
              engenheiroIndex >= 0 ? String(row[engenheiroIndex] || "") : "",
            dataEntrada:
              dataEntradaIndex >= 0 ? String(row[dataEntradaIndex] || "") : "",
            motivoDevolucao:
              motivoIndex >= 0 ? String(row[motivoIndex] || "") : "",
            status:
              statusIndex >= 0
                ? String(row[statusIndex] || "Pendente")
                : "Pendente",
            observacoes:
              observacoesIndex >= 0 ? String(row[observacoesIndex] || "") : "",
          };

          if (item.parceiro || item.equipamento || item.engenheiro) {
            processedData.push(item);
          }
        }

        console.log(
          `Dados de devolução processados: ${processedData.length} itens`
        );

        if (processedData.length === 0) {
          throw new Error(
            "Nenhum dado válido encontrado na planilha de devoluções"
          );
        }

        resolve(processedData);
      } catch (error) {
        console.error("Erro ao processar planilha de devoluções:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Erro na leitura do arquivo:", error);
      reject(
        new Error(
          "Erro ao ler arquivo: " + (error?.target as any)?.error?.message ||
            "Erro desconhecido"
        )
      );
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function processMovimentacaoFile(
  file: File
): Promise<MovimentacaoInternaItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log("Processando arquivo de movimentações internas...");

        let workbook;
        const data = e.target?.result;

        if (!data) {
          throw new Error("Não foi possível ler o arquivo");
        }

        if (data instanceof ArrayBuffer) {
          workbook = XLSX.read(new Uint8Array(data), {
            type: "array",
            cellDates: true,
            raw: true,
          });
        } else {
          throw new Error("Formato de dados não suportado");
        }

        if (
          !workbook ||
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          throw new Error("Arquivo Excel inválido ou corrompido");
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
          raw: true,
        }) as any[][];

        if (!jsonData || jsonData.length < 2) {
          throw new Error(
            "Planilha deve ter pelo menos cabeçalho e uma linha de dados"
          );
        }

        const headers = (jsonData[0] as any[]).map((h) =>
          h !== null && h !== undefined ? String(h).toLowerCase().trim() : ""
        );

        const rows = jsonData.slice(1);

        const getColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(
              (header) => header && header.includes(name.toLowerCase())
            );
            if (index !== -1) return index;
          }
          return -1;
        };

        const idIndex = getColumnIndex(["id", "código", "codigo"]);
        const orcamentoIndex = getColumnIndex([
          "orçamento",
          "orcamento",
          "budget",
        ]);
        const parceiroIndex = getColumnIndex([
          "parceiro",
          "client",
          "customer",
        ]);
        const engenheiroIndex = getColumnIndex([
          "engenheiro",
          "engineer",
          "responsável",
          "responsavel",
        ]);
        const tipoMovimentacaoIndex = getColumnIndex([
          "tipo movimentação",
          "tipo movimentacao",
          "tipo",
          "type",
        ]);
        const dataMovimentacaoIndex = getColumnIndex([
          "data movimentação",
          "data movimentacao",
          "data",
          "date",
        ]);
        const statusIndex = getColumnIndex([
          "status",
          "situação",
          "situacao",
          "estado",
        ]);
        const observacoesIndex = getColumnIndex([
          "observações",
          "observacoes",
          "notes",
          "comentários",
          "comentarios",
        ]);

        const processedData: MovimentacaoInternaItem[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          if (!row || !Array.isArray(row) || row.length === 0) continue;

          const hasContent = row.some(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );
          if (!hasContent) continue;

          const item: MovimentacaoInternaItem = {
            id:
              idIndex >= 0
                ? String(row[idIndex] || `MOV-${i + 1}`)
                : `MOV-${i + 1}`,
            orcamento:
              orcamentoIndex >= 0 ? String(row[orcamentoIndex] || "") : "",
            parceiro:
              parceiroIndex >= 0 ? String(row[parceiroIndex] || "") : "",
            engenheiro:
              engenheiroIndex >= 0 ? String(row[engenheiroIndex] || "") : "",
            tipoMovimentacao:
              tipoMovimentacaoIndex >= 0
                ? String(row[tipoMovimentacaoIndex] || "")
                : "",
            dataMovimentacao:
              dataMovimentacaoIndex >= 0
                ? String(row[dataMovimentacaoIndex] || "")
                : "",
            status:
              statusIndex >= 0
                ? String(row[statusIndex] || "Pendente")
                : "Pendente",
            observacoes:
              observacoesIndex >= 0 ? String(row[observacoesIndex] || "") : "",
          };

          if (item.orcamento || item.parceiro || item.engenheiro) {
            processedData.push(item);
          }
        }

        console.log(
          `Dados de movimentação processados: ${processedData.length} itens`
        );

        if (processedData.length === 0) {
          throw new Error(
            "Nenhum dado válido encontrado na planilha de movimentações"
          );
        }

        resolve(processedData);
      } catch (error) {
        console.error("Erro ao processar planilha de movimentações:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Erro na leitura do arquivo:", error);
      reject(
        new Error(
          "Erro ao ler arquivo: " + (error?.target as any)?.error?.message ||
            "Erro desconhecido"
        )
      );
    };

    reader.readAsArrayBuffer(file);
  });
}
