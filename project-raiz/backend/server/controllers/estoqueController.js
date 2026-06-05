import { prisma } from '../config/db.js'

// Controller de endpoints relacionados ao dashboard/visão geral
export const listarProdutos = async (req, res) => {
    try {
        // Retorna lista de produtos para uso no dashboard
        const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } })
        res.json(produtos)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}

export const buscarEstatisticas = async (req, res) => {
    try {
        // Total de produtos cadastrado
        const totalProdutos = await prisma.produto.count()

        // Puxa apenas campos necessários para calcular alertas
        const produtos = await prisma.produto.findMany({
            select: { quantidade: true, quantidade_minima: true }
        })

        // Calcula quantos produtos estão no nível de alerta (quantidade <= quantidade_minima)
        const totalAlertas = produtos.filter(p => p.quantidade <= p.quantidade_minima).length

        // Total de movimentações registradas
        const movimentacoes = await prisma.movimentacao.count()

        res.json({ totalProdutos, totalAlertas, movimentacoes })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}