import { prisma } from '../config/db.js'

// Controller das operações de controle de estoque (saldos e movimentações)
export const listarSaldos = async (req, res) => {
    try {
        // Busca dados essenciais para a tela de saldos
        const produtos = await prisma.produto.findMany({
            select: { id: true, nome: true, categoria: true, quantidade: true, quantidade_minima: true },
            orderBy: { nome: 'asc' }
        })
        res.json(produtos)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}

export const listarHistorico = async (req, res) => {
    try {
        const periodo = req.query.periodo || 'todos'

        // Calcula filtro de data com base no período solicitado
        let dataFiltro = undefined
        const agora = new Date()

        if (periodo === 'hoje') {
            // Início do dia atual em UTC
            dataFiltro = new Date(Date.UTC(
                agora.getFullYear(),
                agora.getMonth(),
                agora.getDate(),
                0, 0, 0, 0
            ))
        } else if (periodo === '7') {
            dataFiltro = new Date(Date.UTC(
                agora.getFullYear(),
                agora.getMonth(),
                agora.getDate() - 7,
                0, 0, 0, 0
            ))
        } else if (periodo === '30') {
            dataFiltro = new Date(Date.UTC(
                agora.getFullYear(),
                agora.getMonth(),
                agora.getDate() - 30,
                0, 0, 0, 0
            ))
        }
        // periodo === 'todos' => sem filtro de data

        const historico = await prisma.movimentacao.findMany({
            take: 100,
            orderBy: { id: 'desc' },
            where: dataFiltro ? { data_mov: { gte: dataFiltro } } : undefined,
            include: { produto: { select: { nome: true } } }
        })

        // Mapeia para formato leve que o frontend espera
        const resultado = historico.map(m => ({
            data_mov: m.data_mov,
            produto: m.produto.nome,
            tipo: m.tipo,
            quantidade: m.quantidade
        }))

        res.json(resultado)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ error: message })
    }
}

export const registrarMovimentacao = async (req, res) => {
    const { produto_id, tipo, quantidade, data_mov } = req.body
    const qtd = parseInt(quantidade)

    // Validação simples dos campos esperados
    if (!produto_id || !tipo || !qtd || !data_mov) {
        return res.status(400).json({ success: false, error: 'Preencha todos os campos.' })
    }

    try {
        const produto = await prisma.produto.findUnique({ where: { id: parseInt(produto_id) } })

        if (!produto) return res.status(404).json({ success: false, error: 'Produto não encontrado.' })
        if (tipo === 'saida' && produto.quantidade < qtd) {
            return res.status(400).json({ success: false, error: 'Saldo insuficiente.' })
        }

        // Executa update do saldo e criação da movimentação em transação
        await prisma.$transaction([
            prisma.produto.update({
                where: { id: parseInt(produto_id) },
                data: { quantidade: tipo === 'entrada' ? produto.quantidade + qtd : produto.quantidade - qtd }
            }),
            prisma.movimentacao.create({
                data: { produto_id: parseInt(produto_id), tipo, quantidade: qtd, data_mov: new Date(data_mov) }
            })
        ])

        res.json({ success: true, message: 'Movimentação realizada com sucesso!' })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ success: false, error: message })
    }
}