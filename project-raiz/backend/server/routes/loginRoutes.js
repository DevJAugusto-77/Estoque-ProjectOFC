import express from 'express'
import { prisma } from '../config/db.js'

// Rota de login simples que verifica usuário e senha em tabela `User`
const router = express.Router()

router.post('/', async (req, res) => {
    const { usuario, senha } = req.body

    try {
        // Busca primeiro usuário que combine (sem hashing, atenção em produção)
        const user = await prisma.user.findFirst({
            where: {
                usuario: usuario,
                senha: senha
            }
        })

        if (user) {
            res.json({ success: true })
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha incorretos' })
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.status(500).json({ success: false, message: 'Erro no banco', error: message })
    }
})

export default router