// Configuração do Prisma com o adaptador Neon
// - Lê `DATABASE_URL` ou `DIRECT_URL` das variáveis de ambiente
// - Inicializa o cliente Prisma usando o `PrismaNeon` para compatibilidade com Neon/Postgres
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

// Preferência: DATABASE_URL, senão DIRECT_URL (usado pelo Neon como URL direta)
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
if (!connectionString) console.warn('⚠️ Nenhuma connection string encontrada. Defina DATABASE_URL ou DIRECT_URL nas variáveis de ambiente.')

// Adapter Neon que permite ao Prisma comunicar-se com o NeonDB
const adapter = new PrismaNeon({
  connectionString,
})

// Cliente Prisma exportado para uso nas rotas/controlllers
export const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] })