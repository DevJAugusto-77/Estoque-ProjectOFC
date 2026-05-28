async function carregarEstatisticas() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/estatisticas`);
        const data = await response.json();

        document.getElementById('qnt-produtos').innerText = data.totalProdutos;
        document.getElementById('qnt-alertas').innerText = data.totalAlertas;
        document.getElementById('qnt-movimentacao').innerText = data.movimentacoes;

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}

async function carregarTabelaDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/produtos`);
        const produtos = await response.json();
        const tbody = document.getElementById('tabelaProdutosDashboard');
        
        tbody.innerHTML = "";

        produtos.forEach(p => {
            let statusTexto = "";
            let statusClasse = "";

            if (p.quantidade < p.quantidade_minima) {
                statusTexto = "Instável";
                statusClasse = "status-instavel";
            } else if (p.quantidade <= p.quantidade_minima + 5) {
                statusTexto = "Intermediário";
                statusClasse = "status-intermediario";
            } else {
                statusTexto = "Estável";
                statusClasse = "status-estavel";
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nome}</td>
                <td>${p.codigo}</td>
                <td>${p.categoria}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                <td><span class="status-pill ${statusClasse}">${statusTexto}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar tabela do dashboard:", error);
    }
}

window.onload = () => {
    carregarEstatisticas();
    carregarTabelaDashboard();
};

document.getElementById('inputBuscaGeral').addEventListener('input', function() {
    const termo = this.value.toLowerCase();
    const linhas = document.querySelectorAll('#tabelaProdutosDashboard tr');
    linhas.forEach(tr => {
        const texto = tr.innerText.toLowerCase();
        tr.style.display = texto.includes(termo) ? '' : 'none';
    });
});