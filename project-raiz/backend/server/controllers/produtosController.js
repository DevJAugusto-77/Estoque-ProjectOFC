import { prisma } from '../config/db.js'

export const listarProdutos = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } })
        res.json(produtos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const criarProduto = async (req, res) => {
    const { nome, codigo, categoria, quantidade, quantidade_minima, preco, data_cadastro } = req.body
    try {
        const produto = await prisma.produto.create({
            data: { nome, codigo, categoria, quantidade: parseInt(quantidade), quantidade_minima: parseInt(quantidade_minima), preco: parseFloat(preco), data_cadastro: new Date(data_cadastro) }
        })
        res.json({ success: true, message: 'Produto salvo!', id: produto.id })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export const editarProduto = async (req, res) => {
    const { id } = req.params
    const { nome, codigo, categoria, quantidade, quantidade_minima, preco, data_cadastro } = req.body
    try {
        await prisma.produto.update({
            where: { id: parseInt(id) },
            data: { nome, codigo, categoria, quantidade: parseInt(quantidade), quantidade_minima: parseInt(quantidade_minima), preco: parseFloat(preco), data_cadastro: new Date(data_cadastro) }
        })
        res.json({ success: true, message: 'Produto atualizado!' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export const deletarProduto = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.produto.delete({ where: { id: parseInt(id) } })
        res.json({ success: true, message: 'Produto removido!' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}