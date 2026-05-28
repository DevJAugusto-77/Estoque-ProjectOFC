const tableBody = document.getElementById('tabelaSaldos');
const selectProd = document.getElementById('selectProduto');
const formMov = document.getElementById('formMovimentacao');
const tabelaHistorico = document.getElementById('tabelaHistoricoMov');
const filtroHistorico = document.getElementById('filtroHistorico');

async function atualizarTelaControle() {
    try {
        const res = await fetch(`${API_URL}/api/controle/saldos`);
        const produtos = await res.json();

        tableBody.innerHTML = "";
        selectProd.innerHTML = '<option value="">Selecione um produto...</option>';

        produtos.forEach(p => {
            const isLow = p.quantidade <= p.quantidade_minima;
            const cat = p.categoria ? p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1) : "Geral";

            tableBody.innerHTML += `
                <tr>
                    <td>${p.nome}</td>
                    <td><span class="tipo-tag">${cat}</span></td>
                    <td>${p.quantidade}</td>
                    <td>${p.quantidade_minima}</td>
                    <td>${isLow ? '<span class="alert-low">⚠️ BAIXO</span>' : '<span class="status-ok">✅ OK</span>'}</td>
                </tr>`;

            selectProd.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
        });
    } catch (error) {
        console.error("Erro ao carregar saldos:", error);
    }
}

async function carregarHistorico(periodo = 'hoje') {
    try {
        const res = await fetch(`${API_URL}/api/controle/historico?periodo=${periodo}`);
        const historico = await res.json();

        tabelaHistorico.innerHTML = "";

        if (historico.length === 0) {
            tabelaHistorico.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #888;">Nenhuma movimentação encontrada.</td></tr>`;
            return;
        }

        historico.forEach(mov => {
            const dataF = new Date(mov.data_mov).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const cor = mov.tipo === 'entrada' ? '#2ecc71' : '#ff4d4d';
            const sinal = mov.tipo === 'entrada' ? '+' : '-';

            tabelaHistorico.innerHTML += `
                <tr>
                    <td>${dataF}</td>
                    <td>${mov.produto}</td>
                    <td style="color: ${cor}; font-weight: bold;">${sinal} ${mov.tipo.toUpperCase()}</td>
                    <td>${mov.quantidade}</td>
                </tr>`;
        });
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
}

formMov.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        produto_id: selectProd.value,
        tipo: document.getElementById('tipoMov').value,
        quantidade: document.getElementById('qtdMov').value,
        data_mov: document.getElementById('dataMov').value
    };

    try {
        const response = await fetch(`${API_URL}/api/movimentacao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            formMov.reset();

            await atualizarTelaControle();
            await carregarHistorico(filtroHistorico.value);
        } else {
            alert("Erro: " + result.error);
        }
    } catch (error) {
        alert("Erro na conexão com o servidor.");
    }
});

filtroHistorico.addEventListener('change', (e) => {
    carregarHistorico(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
    atualizarTelaControle();
    carregarHistorico(filtroHistorico.value);
});