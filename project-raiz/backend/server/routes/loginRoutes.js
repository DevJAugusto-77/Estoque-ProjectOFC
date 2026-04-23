import express from 'express'
import { prisma } from '../config/db.js'

const router = express.Router()

router.post('/', async (req, res) => {
    const { usuario, senha } = req.body

    try {
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
        res.status(500).json({ success: false, message: 'Erro no banco', error: err.message })
    }
})

export default router