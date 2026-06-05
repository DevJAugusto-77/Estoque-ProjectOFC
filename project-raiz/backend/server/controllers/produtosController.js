import { prisma } from '../config/db.js'

// Controller responsável pelas operações CRUD de `Produto`
// Cada função trata requisições e responde com JSON para o cliente
export const listarProdutos = async (req, res) => {
    try {
        // Busca todos os produtos ordenados pelo nome
        const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } })
        res.json(produtos)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}

export const criarProduto = async (req, res) => {
    // Recebe dados do corpo da requisição para criar um produto
    const { nome, codigo, categoria, quantidade, quantidade_minima, preco, data_cadastro } = req.body
    try {
        const produto = await prisma.produto.create({
            data: {
                nome,
                codigo,
                categoria,
                quantidade: parseInt(quantidade),
                quantidade_minima: parseInt(quantidade_minima),
                preco: parseFloat(preco),
                data_cadastro: new Date(data_cadastro)
            }
        })
        res.json({ success: true, message: 'Produto salvo!', id: produto.id })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ success: false, error: message })
    }
}

export const editarProduto = async (req, res) => {
    const { id } = req.params
    const { nome, codigo, categoria, quantidade, quantidade_minima, preco, data_cadastro } = req.body
    try {
        // Atualiza produto por ID
        await prisma.produto.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                codigo,
                categoria,
                quantidade: parseInt(quantidade),
                quantidade_minima: parseInt(quantidade_minima),
                preco: parseFloat(preco),
                data_cadastro: new Date(data_cadastro)
            }
        })
        res.json({ success: true, message: 'Produto atualizado!' })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ success: false, error: message })
    }
}

export const deletarProduto = async (req, res) => {
    const { id } = req.params
    try {
        // Remove produto por ID
        await prisma.produto.delete({ where: { id: parseInt(id) } })
        res.json({ success: true, message: 'Produto removido!' })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}