import express from 'express'
import { buscarEstatisticas, listarProdutos as listarDashboard } from '../controllers/estoqueController.js'
import { listarProdutos, criarProduto, editarProduto, deletarProduto } from '../controllers/produtosController.js'
import { listarSaldos, listarHistorico, registrarMovimentacao } from '../controllers/controleController.js'

// Router que agrupa todas as rotas relacionadas ao estoque e controle
const router = express.Router()

// Rotas do dashboard (estatísticas e listagem resumida)
router.get('/dashboard/estatisticas', buscarEstatisticas)
router.get('/dashboard/produtos', listarDashboard)

// Rotas CRUD para produtos
router.get('/produtos', listarProdutos)
router.post('/produtos', criarProduto)
router.put('/produtos/:id', editarProduto)
router.delete('/produtos/:id', deletarProduto)

// Rotas para controle de saldos e histórico de movimentações
router.get('/controle/saldos', listarSaldos)
router.get('/controle/historico', listarHistorico)
router.post('/movimentacao', registrarMovimentacao)

export default router