import { prisma } from '../config/db.js'

export const listarProdutos = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } })
        res.json(produtos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const buscarEstatisticas = async (req, res) => {
    try {
        const totalProdutos = await prisma.produto.count()

        const produtos = await prisma.produto.findMany({
            select: { quantidade: true, quantidade_minima: true }
        })
        const totalAlertas = produtos.filter(p => p.quantidade <= p.quantidade_minima).length
        const movimentacoes = await prisma.movimentacao.count()

        res.json({ totalProdutos, totalAlertas, movimentacoes })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}