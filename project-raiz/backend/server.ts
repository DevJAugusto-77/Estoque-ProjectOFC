import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { prisma } from './server/config/db.js'
import loginRoutes from './server/routes/loginRoutes.js'
import estoqueRoutes from './server/routes/estoqueRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ✅ CORS configurado para aceitar requisições do Live Server (portas 5500 e 5501) e do Vercel
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

app.use(express.json())

// ✅ Rotas da API
app.use('/api/login', loginRoutes)
app.use('/api', estoqueRoutes)

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Banco Neon conectado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err)
    process.exit(1)
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Servidor InfoTech rodando!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor InfoTech ONLINE na porta ${PORT}!`)
})

main()