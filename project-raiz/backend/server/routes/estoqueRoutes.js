import express from 'express'
import { buscarEstatisticas, listarProdutos as listarDashboard } from '../controllers/estoqueController.js'
import { listarProdutos, criarProduto, editarProduto, deletarProduto } from '../controllers/produtosController.js'
import { listarSaldos, listarHistorico, registrarMovimentacao } from '../controllers/controleController.js'

const router = express.Router()

router.get('/dashboard/estatisticas', buscarEstatisticas)
router.get('/dashboard/produtos', listarDashboard)

router.get('/produtos', listarProdutos)
router.post('/produtos', criarProduto)
router.put('/produtos/:id', editarProduto)
router.delete('/produtos/:id', deletarProduto)

router.get('/controle/saldos', listarSaldos)
router.get('/controle/historico', listarHistorico)
router.post('/movimentacao', registrarMovimentacao)

export default router