import 'dotenv/config'
import prismaPkg from '../../prisma/generated/prisma/index.js'
import { PrismaNeon } from '@prisma/adapter-neon'

const { PrismaClient } = prismaPkg

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })