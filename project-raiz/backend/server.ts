// Servidor principal (TypeScript) — pontos importantes:
// - Inicializa dotenv para carregar variáveis de ambiente
// - Configura CORS para permitir o frontend local e deploys autorizados
// - Registra rotas e adiciona endpoint de diagnóstico (/api/health)
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { prisma } from './server/config/db.js'
import loginRoutes from './server/routes/loginRoutes.js'
import estoqueRoutes from './server/routes/estoqueRoutes.js'

// Carrega `.env` local (no deploy, prefira configurar variáveis no painel do provedor)
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// CORS: origens permitidas para requisições da API
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

// Parser de JSON para endpoints que recebem corpo (body)
app.use(express.json())

// Registro das rotas principais da API
app.use('/api/login', loginRoutes)
app.use('/api', estoqueRoutes)

// Função principal para testar conexão com o banco no início da aplicação
async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Banco Neon conectado com sucesso!')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ Erro ao conectar ao banco:', message)
    process.exit(1)
  }
}

// Rota raiz simples
app.get('/', (req, res) => {
  res.json({ message: 'Servidor InfoTech rodando!' })
})

// Rota de diagnóstico: tenta conectar e desconectar do banco
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

// Inicia o servidor e chama `main()` para validar conexão com o banco
app.listen(PORT, () => {
  console.log(`🚀 Servidor InfoTech ONLINE na porta ${PORT}!`)
})

main()