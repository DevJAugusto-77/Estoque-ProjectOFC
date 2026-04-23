async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const produtos = await response.json();
        const tbody = document.getElementById('tbodyEstoque');

        if (!tbody) return; // Segurança caso o elemento não exista

        tbody.innerHTML = ""; // Limpa a tabela

        produtos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nome}</td>
                <td>${p.codigo}</td>
                <td>${p.categoria}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                <td>${new Date(p.data_cadastro).toLocaleDateString('pt-BR')}</td>
                <td>
                    <div class="actions">
                        <button class="btn-edit" onclick="abrirModalEdicao(${p.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="deletarProduto(${p.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

document.addEventListener('DOMContentLoaded', carregarProdutos);

// Seletores do Modal
const modal = document.getElementById('productModal');
const btnAbrirModal = document.querySelector('.btn-add'); // O botão roxo lá em cima
const btnFecharModal = document.querySelector('.close-modal');
const btnCancelar = document.getElementById('closeModalBtn');
const formProduto = document.getElementById('productForm');

// Mapa de prefixos por categoria
const prefixosCategoria = {
    eletronicos: 'ELE',
    perifericos: 'PER',
    hardware: 'HAR',
    acessorios: 'ACE',
    impressoras: 'IMP',
    redes: 'RED'
};

// Gera prefixo a partir das 3 primeiras letras da categoria (fallback genérico)
function getPrefixo(categoria) {
    if (prefixosCategoria[categoria]) return prefixosCategoria[categoria];
    return categoria.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
}

// Gera o próximo código com base nos produtos existentes
async function gerarCodigoAutomatico(categoria) {
    const prefixo = getPrefixo(categoria);
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const produtos = await response.json();

        // Filtra produtos com o mesmo prefixo e pega o maior número
        const numeros = produtos
            .map(p => p.codigo)
            .filter(cod => cod && cod.startsWith(prefixo + '-'))
            .map(cod => parseInt(cod.split('-')[1]))
            .filter(n => !isNaN(n));

        const proximoNum = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
        return `${prefixo}-${String(proximoNum).padStart(3, '0')}`;
    } catch (err) {
        console.error('Erro ao gerar código:', err);
        return `${prefixo}-001`;
    }
}

// Abrir Modal
btnAbrirModal.onclick = async () => {
    modal.style.display = 'block';
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataCadastro').value = hoje;

    // Gera o código automático com base na categoria atual
    const categoria = document.getElementById('catProd').value;
    document.getElementById('codProd').value = await gerarCodigoAutomatico(categoria);
}

// Atualiza código quando a categoria mudar no modal de adicionar
document.getElementById('catProd').addEventListener('change', async function () {
    document.getElementById('codProd').value = await gerarCodigoAutomatico(this.value);
});

// Fechar Modal
const fechar = () => modal.style.display = 'none';
btnFecharModal.onclick = fechar;
btnCancelar.onclick = fechar;
window.onclick = (event) => { if (event.target == modal) fechar(); };

// ENVIAR DADOS PARA O BANCO
formProduto.onsubmit = async (e) => {
    e.preventDefault();

    const novoProduto = {
        nome: document.getElementById('nomeProd').value,
        codigo: document.getElementById('codProd').value,
        categoria: document.getElementById('catProd').value,
        preco: document.getElementById('precoProd').value,
        quantidade: document.getElementById('qtdProd').value,
        quantidade_minima: document.getElementById('qtdMinima').value,
        data_cadastro: document.getElementById('dataCadastro').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });

        const result = await response.json();

        if (result.success) {
            alert("Produto cadastrado com sucesso!");
            fechar();
            formProduto.reset();
            carregarProdutos(); // Recarrega a tabela automaticamente
        } else {
            alert("Erro ao cadastrar: " + result.error);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
};

// --- FUNÇÃO DE DELETAR ---
let idParaDeletar = null;
const deleteModal = document.getElementById('deleteConfirmModal');

// Função chamada pelo botão da tabela
function deletarProduto(id) {
    idParaDeletar = id;
    deleteModal.style.display = 'block';
}

// Fechar modal de deletar
const fecharDelete = () => deleteModal.style.display = 'none';
document.getElementById('closeDeleteX').onclick = fecharDelete;
document.getElementById('btnCancelDelete').onclick = fecharDelete;

// Confirmar a exclusão via API
document.getElementById('btnConfirmDelete').onclick = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${idParaDeletar}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            fecharDelete();
            carregarProdutos(); // Recarrega a tabela
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
};

// --- LÓGICA DE EDIÇÃO ---
const editModal = document.getElementById('editProductModal');
const editForm = document.getElementById('editProductForm');
let idProdutoEdicao = null;

// Abrir modal e preencher dados
async function abrirModalEdicao(id) {
    idProdutoEdicao = id;
    try {
        // Buscamos a lista atual para pegar os dados do produto específico
        const response = await fetch('http://localhost:3000/api/produtos');
        const produtos = await response.json();
        const p = produtos.find(item => item.id === id);

        if (p) {
            document.getElementById('editNomeProd').value = p.nome;
            document.getElementById('editCodProd').value = p.codigo;
            document.getElementById('editCatProd').value = p.categoria;
            document.getElementById('editPrecoProd').value = p.preco;
            document.getElementById('editQtdProd').value = p.quantidade;
            document.getElementById('editQtdMinima').value = p.quantidade_minima;
            // Formata data para o input date (YYYY-MM-DD)
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('editDataCadastro').value = hoje;

            editModal.style.display = 'block';
        }
    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
    }
}

// Fechar modal de edição
const fecharEdicao = () => editModal.style.display = 'none';
document.getElementById('closeEditX').onclick = fecharEdicao;
document.getElementById('btnCancelEdit').onclick = fecharEdicao;

// Enviar atualização
editForm.onsubmit = async (e) => {
    e.preventDefault();

    // Busca quantidade anterior
    const response0 = await fetch('http://localhost:3000/api/produtos');
    const produtos0 = await response0.json();
    const produtoAnterior = produtos0.find(item => item.id === idProdutoEdicao);
    const qtdAnterior = produtoAnterior ? parseInt(produtoAnterior.quantidade) : 0;

    const produtoEditado = {
        nome: document.getElementById('editNomeProd').value,
        codigo: document.getElementById('editCodProd').value,
        categoria: document.getElementById('editCatProd').value,
        preco: document.getElementById('editPrecoProd').value,
        quantidade: document.getElementById('editQtdProd').value,
        quantidade_minima: document.getElementById('editQtdMinima').value,
        data_cadastro: document.getElementById('editDataCadastro').value
    };

    const qtdNova = parseInt(produtoEditado.quantidade);
    const diferenca = qtdNova - qtdAnterior;

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${idProdutoEdicao}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produtoEditado)
        });

        const result = await response.json();

        if (result.success) {
            // Registra movimentação automática se houver diferença
            if (diferenca !== 0) {
                await fetch('http://localhost:3000/api/movimentacao', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        produto_id: idProdutoEdicao,
                        tipo: diferenca > 0 ? 'entrada' : 'saida',
                        quantidade: Math.abs(diferenca),
                        data_mov: new Date().toISOString().split('T')[0]
                    })
                });
            }

            alert("Produto atualizado!");
            fecharEdicao();
            carregarProdutos();
        } else {
            alert("Erro ao atualizar: " + result.error);
        }
    } catch (error) {
        console.error("Erro na requisição de edição:", error);
    }
};

document.getElementById('searchProduct').addEventListener('input', function () {
    const termo = this.value.toLowerCase();
    const linhas = document.querySelectorAll('#tbodyEstoque tr');
    linhas.forEach(tr => {
        const texto = tr.innerText.toLowerCase();
        tr.style.display = texto.includes(termo) ? '' : 'none';
    });
});