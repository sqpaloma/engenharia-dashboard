// Função para formatar JSON de forma legível
function formatJSON(json) {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch (e) {
    return json;
  }
}

// Função para verificar e exibir os dados
function checkLocalStorage() {
  const output = document.getElementById("output");
  let html = "<h2>Dados do localStorage:</h2>";

  // Verificar dados do dashboard
  html += "<h3>=== Dados do Dashboard ===</h3>";
  const dashboardData = localStorage.getItem("dashboard-data");
  if (dashboardData) {
    html += `<pre>${formatJSON(dashboardData)}</pre>`;
  } else {
    html += "<p>Nenhum dado encontrado no dashboard</p>";
  }

  html += "<h3>=== Dados de Aguardando Aprovação ===</h3>";
  const followUpData = localStorage.getItem("followup-data");
  if (followUpData) {
    html += `<pre>${formatJSON(followUpData)}</pre>`;
  } else {
    html += "<p>Nenhum dado de aguardando aprovação encontrado</p>";
  }

  // Verificar dados de devolução
  html += "<h3>=== Dados de Devolução ===</h3>";
  const devolucaoData = localStorage.getItem("devolucao-data");
  if (devolucaoData) {
    html += `<pre>${formatJSON(devolucaoData)}</pre>`;
  } else {
    html += "<p>Nenhum dado de devolução encontrado</p>";
  }

  // Verificar dados de movimentação
  html += "<h3>=== Dados de Movimentação ===</h3>";
  const movimentacaoData = localStorage.getItem("movimentacao-data");
  if (movimentacaoData) {
    html += `<pre>${formatJSON(movimentacaoData)}</pre>`;
  } else {
    html += "<p>Nenhum dado de movimentação encontrado</p>";
  }

  output.innerHTML = html;
}

// Criar elementos HTML
document.body.innerHTML = `
  <div id="output"></div>
  <button onclick="checkLocalStorage()">Verificar localStorage</button>
`;

// Executar verificação inicial
checkLocalStorage();
