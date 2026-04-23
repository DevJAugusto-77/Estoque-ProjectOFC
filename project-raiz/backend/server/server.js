import express from 'express'
import cors from 'cors'
import loginRoutes from './routes/loginRoutes.js'
import estoqueRoutes from './routes/estoqueRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/login', loginRoutes)
app.use('/api', estoqueRoutes)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor InfoTech ONLINE na porta ${PORT}!`)
})