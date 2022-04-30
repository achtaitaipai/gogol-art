import express from 'express'
import 'dotenv/config'
import path from 'path'
import cors from 'cors'

import InfosController from './controllers/infos.controller'
import SearchRouter from './controllers/search.controller'

const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, './client')))

app.get('/', (_, res) => {
	console.log('oe')
	res.sendFile(path.resolve(__dirname, './client', 'index.html'))
})

app.get('/slide', (_, res) => {
	res.sendFile(path.resolve(__dirname, './client', '/slide/slide.html'))
})

app.use('/api/search', SearchRouter)
app.use('/api/infos', InfosController)

app.listen(PORT, () => console.log(`http://loacalhost:${PORT}`))
