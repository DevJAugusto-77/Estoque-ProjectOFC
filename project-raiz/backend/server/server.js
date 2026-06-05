// Servidor Express simples para a API de estoque
// - Importamos dependências e rotas
import express from 'express'
import cors from 'cors'
import loginRoutes from './routes/loginRoutes.js'
import estoqueRoutes from './routes/estoqueRoutes.js'
import { prisma } from './config/db.js' // Prisma/Neon adapter (conexão com o banco)

const app = express()

// CORS: configura quais origens podem acessar a API
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5501',
        'http://127.0.0.1:5501',
        'http://localhost:3000',
        'https://info-tech-project-2-0.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}))

// Parser JSON para o corpo das requisições
app.use(express.json())

// Registro das rotas da aplicação
app.use('/api/login', loginRoutes)
app.use('/api', estoqueRoutes)

// Rota principal simples para verificação rápida
app.get('/', (req, res) => {
    res.json({ message: 'Servidor InfoTech rodando (JS)!' })
})

// Rota de diagnóstico: verifica se o servidor consegue conectar ao banco
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$connect()
        await prisma.$disconnect()
        res.json({ status: 'ok', database: 'connected' })
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ status: 'error', error: message })
    }
})

// Inicia o servidor na porta configurada
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor InfoTech ONLINE na porta ${PORT}!`)
})