import express from 'express'
import dotenv from 'dotenv'
import { prisma } from './server/config/db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

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
  res.json({ message: 'Servidor rodando!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})

main()