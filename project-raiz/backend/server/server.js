import express from 'express'
import cors from 'cors'
import loginRoutes from './routes/loginRoutes.js'
import estoqueRoutes from './routes/estoqueRoutes.js'

const app = express()

// ✅ CORS configurado para aceitar o Vercel e o local
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'https://info-tech-project-2-0.vercel.app' // ⚠️ Substitua pela URL real do seu projeto no Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}))

app.use(express.json())

app.use('/api/login', loginRoutes)
app.use('/api', estoqueRoutes)

// ✅ PORT dinâmica — obrigatório para Railway/Render/etc
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor InfoTech ONLINE na porta ${PORT}!`)
})